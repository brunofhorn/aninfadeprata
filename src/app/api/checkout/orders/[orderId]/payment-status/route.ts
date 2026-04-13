import { NextResponse } from 'next/server'
import { serializePaymentStatus } from '@/server/checkout/mappers'
import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'
import { pagBankRequest } from '@/server/pagbank/client'
import { mapPagBankChargeStatus, type PagBankCharge } from '@/server/pagbank/mappers'

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

  if (payment.provider === 'PAGBANK' && payment.providerPaymentId) {
    try {
      const charge = await pagBankRequest<PagBankCharge>(`/charges/${payment.providerPaymentId}`, {
        method: 'GET',
      })
      const mappedStatus = mapPagBankChargeStatus(charge.status)

      currentPayment = await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: mappedStatus.dbPaymentStatus,
          paidAt: charge.paid_at ? new Date(charge.paid_at) : payment.paidAt,
          failureReason: charge.payment_response?.message ?? payment.failureReason,
          cardBrand: charge.payment_method?.card?.brand ?? payment.cardBrand,
          cardFirstSix: charge.payment_method?.card?.first_digits ?? payment.cardFirstSix,
          cardLastFour: charge.payment_method?.card?.last_digits ?? payment.cardLastFour,
          rawResponse: JSON.parse(JSON.stringify(charge)),
        },
      })

      await prisma.order.update({
        where: {
          id: payment.orderId,
        },
        data: {
          paymentStatus: mappedStatus.dbPaymentStatus,
          status: mappedStatus.dbOrderStatus,
          paidAt: charge.paid_at ? new Date(charge.paid_at) : payment.paidAt,
        },
      })
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
