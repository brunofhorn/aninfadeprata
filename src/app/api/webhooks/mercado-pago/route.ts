import { NextResponse } from 'next/server'
import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'
import { mercadoPagoRequest } from '@/server/mercado-pago/client'
import {
  mapMercadoPagoPaymentStatus,
  normalizeMercadoPagoPaymentId,
  type MercadoPagoPayment,
} from '@/server/mercado-pago/mappers'
import { verifyMercadoPagoWebhookSignature } from '@/server/mercado-pago/webhook'

export const runtime = 'nodejs'

function getNotificationPaymentId(payload: unknown, request: Request) {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    payload.data &&
    typeof payload.data === 'object' &&
    'id' in payload.data &&
    (typeof payload.data.id === 'string' || typeof payload.data.id === 'number')
  ) {
    return String(payload.data.id)
  }

  const url = new URL(request.url)
  return url.searchParams.get('data.id') ?? url.searchParams.get('id')
}

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: 'DATABASE_URL nao configurada.' },
      { status: 503 },
    )
  }

  const payload = await request.json()
  const prisma = getPrismaClient()
  const isSignatureValid = verifyMercadoPagoWebhookSignature({ payload, request })
  const paymentId = getNotificationPaymentId(payload, request)

  const webhook = await prisma.webhookEvent.create({
    data: {
      provider: 'MERCADO_PAGO',
      externalEventId:
        typeof payload?.id === 'string' || typeof payload?.id === 'number'
          ? String(payload.id)
          : paymentId,
      eventType:
        typeof payload?.action === 'string'
          ? payload.action
          : typeof payload?.type === 'string'
            ? payload.type
            : 'UNKNOWN',
      processingStatus: isSignatureValid ? 'PENDING' : 'IGNORED',
      errorMessage: isSignatureValid ? null : 'Assinatura do webhook do Mercado Pago invalida.',
      payload,
    },
  })

  if (!isSignatureValid) {
    return NextResponse.json(
      {
        received: true,
        ignored: true,
        webhookId: webhook.id,
      },
      { status: 202 },
    )
  }

  try {
    if (!paymentId) {
      await prisma.webhookEvent.update({
        where: {
          id: webhook.id,
        },
        data: {
          processingStatus: 'IGNORED',
          processedAt: new Date(),
          errorMessage: 'Webhook sem data.id para consultar o pagamento.',
        },
      })

      return NextResponse.json(
        {
          received: true,
          ignored: true,
          webhookId: webhook.id,
        },
        { status: 202 },
      )
    }

    const remotePayment = await mercadoPagoRequest<MercadoPagoPayment>(`/v1/payments/${paymentId}`, {
      method: 'GET',
    })
    const providerPaymentId = normalizeMercadoPagoPaymentId(remotePayment.id)
    const externalReference = remotePayment.external_reference

    if (!externalReference || !providerPaymentId) {
      await prisma.webhookEvent.update({
        where: {
          id: webhook.id,
        },
        data: {
          processingStatus: 'IGNORED',
          processedAt: new Date(),
          errorMessage: 'Pagamento recebido sem external_reference ou id valido.',
        },
      })

      return NextResponse.json(
        {
          received: true,
          ignored: true,
          webhookId: webhook.id,
        },
        { status: 202 },
      )
    }

    const order = await prisma.order.findUnique({
      where: {
        code: externalReference,
      },
    })

    if (!order) {
      await prisma.webhookEvent.update({
        where: {
          id: webhook.id,
        },
        data: {
          processingStatus: 'IGNORED',
          processedAt: new Date(),
          errorMessage: `Nenhum pedido encontrado para external_reference ${externalReference}.`,
        },
      })

      return NextResponse.json(
        {
          received: true,
          ignored: true,
          webhookId: webhook.id,
        },
        { status: 202 },
      )
    }

    const mappedStatus = mapMercadoPagoPaymentStatus(
      remotePayment.status,
      remotePayment.status_detail,
    )
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { providerPaymentId },
          { orderId: order.id, provider: 'MERCADO_PAGO' },
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
          providerPaymentId,
          status: mappedStatus.dbPaymentStatus,
          paidAt: remotePayment.date_approved ? new Date(remotePayment.date_approved) : payment.paidAt,
          failureReason: remotePayment.status_detail ?? payment.failureReason,
          cardBrand: remotePayment.payment_method_id ?? payment.cardBrand,
          cardFirstSix: remotePayment.card?.first_six_digits ?? payment.cardFirstSix,
          cardLastFour: remotePayment.card?.last_four_digits ?? payment.cardLastFour,
          installments: remotePayment.installments ?? payment.installments,
          rawResponse: JSON.parse(JSON.stringify(remotePayment)),
          events: {
            create: {
              providerEventId:
                typeof payload?.id === 'string' || typeof payload?.id === 'number'
                  ? String(payload.id)
                  : providerPaymentId,
              eventType:
                typeof payload?.action === 'string'
                  ? payload.action
                  : `WEBHOOK_${remotePayment.status ?? 'UNKNOWN'}`,
              previousStatus: payment.status,
              nextStatus: mappedStatus.dbPaymentStatus,
              payload: JSON.parse(JSON.stringify(payload)),
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
          paidAt: remotePayment.date_approved ? new Date(remotePayment.date_approved) : order.paidAt,
        },
      })
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
