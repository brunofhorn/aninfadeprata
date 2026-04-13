import { NextResponse } from 'next/server'
import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'
import { getChargeFromOrderPayload, mapPagBankChargeStatus } from '@/server/pagbank/mappers'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: 'DATABASE_URL nao configurada.' },
      { status: 503 },
    )
  }

  const payload = await request.json()
  const prisma = getPrismaClient()
  const charge = getChargeFromOrderPayload(payload)

  const webhook = await prisma.webhookEvent.create({
    data: {
      provider: 'PAGBANK',
      externalEventId:
        typeof payload?.id === 'string'
          ? payload.id
          : typeof payload?.event_id === 'string'
            ? payload.event_id
            : null,
      eventType:
        typeof payload?.event === 'string'
          ? payload.event
          : typeof payload?.type === 'string'
            ? payload.type
            : 'UNKNOWN',
      payload,
    },
  })

  try {
    if (
      payload &&
      typeof payload === 'object' &&
      'reference_id' in payload &&
      typeof payload.reference_id === 'string' &&
      charge
    ) {
      const order = await prisma.order.findUnique({
        where: {
          code: payload.reference_id,
        },
      })

      if (order) {
        const mappedStatus = mapPagBankChargeStatus(charge.status)

        const payment = await prisma.payment.findFirst({
          where: {
            OR: [
              { providerPaymentId: charge.id },
              { orderId: order.id, provider: 'PAGBANK' },
            ],
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        if (payment) {
          await prisma.payment.update({
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
              rawResponse: payload,
              events: {
                create: {
                  eventType: `WEBHOOK_${charge.status}`,
                  previousStatus: payment.status,
                  nextStatus: mappedStatus.dbPaymentStatus,
                  payload,
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
              paidAt: charge.paid_at ? new Date(charge.paid_at) : order.paidAt,
            },
          })
        }
      }
    }

    await prisma.webhookEvent.update({
      where: {
        id: webhook.id,
      },
      data: {
        processingStatus: 'PROCESSED',
        processedAt: new Date(),
      },
    })
  } catch (error) {
    await prisma.webhookEvent.update({
      where: {
        id: webhook.id,
      },
      data: {
        processingStatus: 'FAILED',
        processedAt: new Date(),
        errorMessage: error instanceof Error ? error.message : 'Falha ao processar webhook.',
      },
    })
  }

  return NextResponse.json(
    {
      received: true,
      webhookId: webhook.id,
    },
    { status: 202 },
  )
}
