import { NextResponse } from 'next/server'
import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'
import { mercadoPagoRequest } from '@/server/mercado-pago/client'
import {
  mapMercadoPagoPaymentStatus,
  normalizeMercadoPagoPaymentId,
  type MercadoPagoPayment,
} from '@/server/mercado-pago/mappers'

export const runtime = 'nodejs'

interface RouteContext {
  params: Promise<{
    orderId: string
  }>
}

function getBaseUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.APP_URL?.trim()

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '')
  }

  const url = new URL(request.url)
  return `${url.protocol}//${url.host}`
}

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const firstName = parts.shift() ?? fullName
  const lastName = parts.join(' ')

  return {
    firstName,
    lastName: lastName || firstName,
  }
}

interface CardPaymentRequestBody {
  token: string
  paymentMethodId: string
  issuerId?: string
  installments: number
}

export async function POST(request: Request, context: RouteContext) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: 'DATABASE_URL nao configurada.' },
      { status: 503 },
    )
  }

  try {
    const { orderId } = await context.params
    const payload = (await request.json()) as CardPaymentRequestBody
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
        { message: 'Pedido sem itens nao pode ser cobrado com cartao.' },
        { status: 400 },
      )
    }

    if (!payload.token || !payload.paymentMethodId || !payload.installments) {
      return NextResponse.json(
        { message: 'Os dados tokenizados do cartao nao foram informados.' },
        { status: 400 },
      )
    }

    const baseUrl = getBaseUrl(request)
    const notificationUrl =
      process.env.MERCADO_PAGO_WEBHOOK_URL?.trim() ||
      `${baseUrl}/api/webhooks/mercado-pago`
    const digitsPhone = (order.customer.phone ?? '').replace(/\D/g, '')
    const phone =
      digitsPhone.length >= 10
        ? {
            area_code: digitsPhone.slice(0, 2),
            number: digitsPhone.slice(2),
          }
        : undefined
    const { firstName, lastName } = splitFullName(order.customer.fullName)
    const webhookUrl = new URL(notificationUrl)
    webhookUrl.searchParams.set('source_news', 'webhooks')

    const remotePayment = await mercadoPagoRequest<MercadoPagoPayment>(
      '/v1/payments',
      {
        method: 'POST',
        body: JSON.stringify({
          additional_info: {
            items: [
              {
                id: item.productVariantId ?? item.id,
                title: item.title,
                description: item.title,
                quantity: item.quantity,
                unit_price: Number(item.unitPriceAmount),
                category_id: 'books',
              },
            ],
            payer: {
              first_name: firstName,
              last_name: lastName,
              phone,
              address: order.shippingAddress
                ? {
                    zip_code: order.shippingAddress.zipCode.replace(/\D/g, ''),
                    street_name: order.shippingAddress.street,
                    street_number: Number(order.shippingAddress.number.replace(/\D/g, '')) || 0,
                  }
                : undefined,
            },
            shipments: order.shippingAddress
              ? {
                  receiver_address: {
                    zip_code: order.shippingAddress.zipCode.replace(/\D/g, ''),
                    state_name: order.shippingAddress.state.toUpperCase(),
                    city_name: order.shippingAddress.city,
                    street_name: order.shippingAddress.street,
                    street_number:
                      Number(order.shippingAddress.number.replace(/\D/g, '')) || 0,
                  },
                }
              : undefined,
          },
          binary_mode: false,
          capture: true,
          description: item.title,
          external_reference: order.code,
          installments: payload.installments,
          issuer_id: payload.issuerId ? Number(payload.issuerId) : undefined,
          notification_url: webhookUrl.toString(),
          payer: {
            email: order.customer.email,
            entity_type: 'individual',
            type: 'customer',
            first_name: firstName,
            last_name: lastName,
            identification: order.customer.cpf
              ? {
                  type: 'CPF',
                  number: order.customer.cpf.replace(/\D/g, ''),
                }
              : undefined,
          },
          payment_method_id: payload.paymentMethodId,
          token: payload.token,
          transaction_amount: Number(order.totalAmount),
        }),
      },
    )

    const mappedStatus = mapMercadoPagoPaymentStatus(
      remotePayment.status,
      remotePayment.status_detail,
    )
    const providerPaymentId = normalizeMercadoPagoPaymentId(remotePayment.id)

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'MERCADO_PAGO',
        method: 'CREDIT_CARD',
        status: mappedStatus.dbPaymentStatus,
        amount: order.totalAmount,
        installments: payload.installments,
        providerPaymentId,
        providerReference: order.code,
        holderName: order.customer.fullName,
        holderCpf: order.customer.cpf,
        cardBrand: remotePayment.payment_method_id ?? null,
        cardFirstSix: remotePayment.card?.first_six_digits ?? null,
        cardLastFour: remotePayment.card?.last_four_digits ?? null,
        paidAt: remotePayment.date_approved ? new Date(remotePayment.date_approved) : null,
        failureReason: remotePayment.status_detail ?? null,
        rawResponse: JSON.parse(JSON.stringify(remotePayment)),
        events: {
          create: {
            providerEventId: providerPaymentId,
            eventType: 'MERCADO_PAGO_PAYMENT_CREATED',
            nextStatus: mappedStatus.dbPaymentStatus,
            payload: JSON.parse(JSON.stringify(remotePayment)),
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
        paidAt: remotePayment.date_approved ? new Date(remotePayment.date_approved) : null,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      paymentId: payment.id,
      providerPaymentId,
      status: mappedStatus.frontendPaymentStatus,
      statusDetail: remotePayment.status_detail,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Nao foi possivel processar o pagamento com cartao no Mercado Pago.' },
      { status: 500 },
    )
  }
}
