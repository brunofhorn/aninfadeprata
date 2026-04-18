import { NextResponse } from 'next/server'
import { serializePaymentStatus } from '@/server/checkout/mappers'
import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'
import { mercadoPagoRequest } from '@/server/mercado-pago/client'
import {
  mapMercadoPagoPaymentStatus,
  normalizeMercadoPagoPaymentId,
  type MercadoPagoPayment,
  type MercadoPagoPaymentSearchResponse,
} from '@/server/mercado-pago/mappers'

export const runtime = 'nodejs'

interface RouteContext {
  params: Promise<{
    orderId: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: 'DATABASE_URL nao configurada.' },
      { status: 503 },
    )
  }

  const { orderId } = await context.params
  const prisma = getPrismaClient()
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      code: true,
    },
  })

  if (!order) {
    return NextResponse.json({ message: 'Pedido nao encontrado.' }, { status: 404 })
  }

  const payment = await prisma.payment.findFirst({
    where: {
      orderId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (!payment) {
    return NextResponse.json({ message: 'Pagamento nao encontrado.' }, { status: 404 })
  }

  let currentPayment = payment

  if (payment.provider === 'MERCADO_PAGO' && payment.providerPaymentId) {
    try {
      const remotePayment = await mercadoPagoRequest<MercadoPagoPayment>(
        `/v1/payments/${payment.providerPaymentId}`,
        {
          method: 'GET',
        },
      )
      const mappedStatus = mapMercadoPagoPaymentStatus(
        remotePayment.status,
        remotePayment.status_detail,
      )

      currentPayment = await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: mappedStatus.dbPaymentStatus,
          paidAt: remotePayment.date_approved ? new Date(remotePayment.date_approved) : payment.paidAt,
          failureReason: remotePayment.status_detail ?? payment.failureReason,
          cardBrand: remotePayment.payment_method_id ?? payment.cardBrand,
          cardFirstSix: remotePayment.card?.first_six_digits ?? payment.cardFirstSix,
          cardLastFour: remotePayment.card?.last_four_digits ?? payment.cardLastFour,
          installments: remotePayment.installments ?? payment.installments,
          rawResponse: JSON.parse(JSON.stringify(remotePayment)),
        },
      })

      await prisma.order.update({
        where: {
          id: payment.orderId,
        },
        data: {
          paymentStatus: mappedStatus.dbPaymentStatus,
          status: mappedStatus.dbOrderStatus,
          paidAt: remotePayment.date_approved
            ? new Date(remotePayment.date_approved)
            : payment.paidAt,
        },
      })
    } catch {
      currentPayment = payment
    }
  }

  if (payment.provider === 'MERCADO_PAGO' && !payment.providerPaymentId) {
    try {
      const endDate = new Date()
      const beginDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
      const searchParams = new URLSearchParams({
        sort: 'date_created',
        criteria: 'desc',
        external_reference: order.code,
        range: 'date_created',
        begin_date: beginDate.toISOString(),
        end_date: endDate.toISOString(),
        limit: '1',
      })
      const searchResult = await mercadoPagoRequest<MercadoPagoPaymentSearchResponse>(
        `/v1/payments/search?${searchParams.toString()}`,
        {
          method: 'GET',
        },
      )
      const remotePayment = searchResult.results?.[0]

      if (remotePayment) {
        const mappedStatus = mapMercadoPagoPaymentStatus(
          remotePayment.status,
          remotePayment.status_detail,
        )
        const providerPaymentId = normalizeMercadoPagoPaymentId(remotePayment.id)

        currentPayment = await prisma.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            providerPaymentId,
            status: mappedStatus.dbPaymentStatus,
            paidAt: remotePayment.date_approved ? new Date(remotePayment.date_approved) : payment.paidAt,
            failureReason: remotePayment.status_detail ?? payment.failureReason,
            cardBrand: remotePayment.payment_method_id ?? payment.cardBrand,
            cardFirstSix: remotePayment.card?.first_six_digits ?? payment.cardFirstSix,
            cardLastFour: remotePayment.card?.last_four_digits ?? payment.cardLastFour,
            installments: remotePayment.installments ?? payment.installments,
            rawResponse: JSON.parse(JSON.stringify(remotePayment)),
          },
        })

        await prisma.order.update({
          where: {
            id: payment.orderId,
          },
          data: {
            paymentStatus: mappedStatus.dbPaymentStatus,
            status: mappedStatus.dbOrderStatus,
            paidAt: remotePayment.date_approved
              ? new Date(remotePayment.date_approved)
              : payment.paidAt,
          },
        })
      }
    } catch {
      currentPayment = payment
    }
  }

  return NextResponse.json(
    serializePaymentStatus({
      id: currentPayment.id,
      orderId: currentPayment.orderId,
      method: currentPayment.method,
      status: currentPayment.status,
      paidAt: currentPayment.paidAt,
      pixQrCodeText: currentPayment.pixQrCodeText,
      pixQrCodeImageUrl: currentPayment.pixQrCodeImageUrl,
      pixExpiresAt: currentPayment.pixExpiresAt,
    }),
  )
}
