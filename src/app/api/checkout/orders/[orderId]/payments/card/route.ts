import { NextResponse } from 'next/server'
import { serializePaymentStatus } from '@/server/checkout/mappers'
import { createCardPaymentSchema } from '@/server/checkout/schemas'
import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'
import { pagBankRequest } from '@/server/pagbank/client'
import { getChargeFromOrderPayload, mapPagBankChargeStatus, type PagBankOrderResponse } from '@/server/pagbank/mappers'

export const runtime = 'nodejs'

interface RouteContext {
  params: Promise<{
    orderId: string
  }>
}

export async function POST(request: Request, context: RouteContext) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: 'DATABASE_URL nao configurada.' },
      { status: 503 },
    )
  }

  try {
    const payload = createCardPaymentSchema.parse(await request.json())
    const { orderId } = await context.params
    const prisma = getPrismaClient()
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        customer: true,
        items: {
          take: 1,
          orderBy: {
            createdAt: 'asc',
          },
        },
        shippingAddress: true,
      },
    })

    if (!order) {
      return NextResponse.json({ message: 'Pedido nao encontrado.' }, { status: 404 })
    }

    const item = order.items[0]

    if (!item) {
      return NextResponse.json(
        { message: 'Pedido sem itens nao pode ser enviado ao PagBank.' },
        { status: 400 },
      )
    }

    const digitsPhone = (order.customer.phone ?? '').replace(/\D/g, '')
    const phone =
      digitsPhone.length >= 10
        ? {
            country: '55',
            area: digitsPhone.slice(0, 2),
            number: digitsPhone.slice(2),
            type: 'MOBILE',
          }
        : null

    const notificationUrl = process.env.PAGBANK_WEBHOOK_URL?.trim()
    const softDescriptor = process.env.PAGBANK_SOFT_DESCRIPTOR?.trim()
    const pagBankOrder = await pagBankRequest<PagBankOrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        reference_id: order.code,
        customer: {
          name: order.customer.fullName,
          email: order.customer.email,
          tax_id: order.customer.cpf?.replace(/\D/g, ''),
          phones: phone ? [phone] : undefined,
        },
        items: [
          {
            reference_id: item.productVariantId ?? item.id,
            name: item.title,
            quantity: item.quantity,
            unit_amount: Math.round(Number(item.unitPriceAmount) * 100),
          },
        ],
        shipping: order.shippingAddress
          ? {
              address: {
                street: order.shippingAddress.street,
                number: order.shippingAddress.number,
                complement: order.shippingAddress.complement ?? undefined,
                locality: order.shippingAddress.neighborhood,
                city: order.shippingAddress.city,
                region_code: order.shippingAddress.state.toUpperCase(),
                country: 'BRA',
                postal_code: order.shippingAddress.zipCode.replace(/\D/g, ''),
              },
            }
          : undefined,
        notification_urls: notificationUrl ? [notificationUrl] : undefined,
        charges: [
          {
            reference_id: `${order.code}-card`,
            description: item.title,
            amount: {
              value: Math.round(Number(order.totalAmount) * 100),
              currency: 'BRL',
            },
            payment_method: {
              type: 'CREDIT_CARD',
              installments: payload.installments,
              capture: true,
              card: {
                encrypted: payload.encrypted_card,
                store: false,
              },
              holder: {
                name: payload.holder_name,
                tax_id: payload.holder_cpf.replace(/\D/g, ''),
              },
              ...(softDescriptor ? { soft_descriptor: softDescriptor } : {}),
            },
          },
        ],
      }),
    })

    const charge = getChargeFromOrderPayload(pagBankOrder)

    if (!charge) {
      throw new Error('O PagBank nao retornou a cobranca do cartao.')
    }

    const mappedStatus = mapPagBankChargeStatus(charge.status)

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'PAGBANK',
        method: 'CREDIT_CARD',
        status: mappedStatus.dbPaymentStatus,
        amount: order.totalAmount,
        installments: payload.installments,
        holderName: payload.holder_name,
        holderCpf: payload.holder_cpf,
        providerPaymentId: charge.id,
        providerReference: pagBankOrder.id,
        cardBrand: charge.payment_method?.card?.brand,
        cardFirstSix: charge.payment_method?.card?.first_digits,
        cardLastFour: charge.payment_method?.card?.last_digits,
        paidAt: charge.paid_at ? new Date(charge.paid_at) : null,
        rawResponse: JSON.parse(JSON.stringify(pagBankOrder)),
        events: {
          create: {
            eventType: `PAGBANK_CARD_${charge.status}`,
            nextStatus: mappedStatus.dbPaymentStatus,
            payload: JSON.parse(JSON.stringify(pagBankOrder)),
          },
        },
      },
    })

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentStatus: mappedStatus.dbPaymentStatus,
        status: mappedStatus.dbOrderStatus,
        paidAt: payment.paidAt,
      },
    })

    return NextResponse.json(
      serializePaymentStatus({
        id: payment.id,
        orderId: payment.orderId,
        method: payment.method,
        status: payment.status,
        paidAt: payment.paidAt,
        pixQrCodeText: payment.pixQrCodeText,
        pixQrCodeImageUrl: payment.pixQrCodeImageUrl,
        pixExpiresAt: payment.pixExpiresAt,
      }),
    )
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Nao foi possivel processar o pagamento com cartao.' },
      { status: 500 },
    )
  }
}
