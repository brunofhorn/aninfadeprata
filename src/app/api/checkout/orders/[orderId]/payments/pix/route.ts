import { NextResponse } from 'next/server'
import { buildPixQrCodeImageUrl, generateStaticPixPayload } from '@/features/payment/utils/pix'
import { serializePixPayment } from '@/server/checkout/mappers'
import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'

export const runtime = 'nodejs'

interface RouteContext {
  params: Promise<{
    orderId: string
  }>
}

export async function POST(_request: Request, context: RouteContext) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: 'DATABASE_URL nao configurada.' },
      { status: 503 },
    )
  }

  const pixKey = process.env.NEXT_PUBLIC_PIX_KEY?.trim()

  if (!pixKey) {
    return NextResponse.json(
      { message: 'A chave Pix nao foi configurada no ambiente.' },
      { status: 500 },
    )
  }

  const receiverName = process.env.NEXT_PUBLIC_PIX_RECEIVER_NAME?.trim() || 'SARA BORGES'
  const receiverCity = process.env.NEXT_PUBLIC_PIX_RECEIVER_CITY?.trim() || 'SAO JOSE'
  const { orderId } = await context.params
  const prisma = getPrismaClient()
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  })

  if (!order) {
    return NextResponse.json({ message: 'Pedido nao encontrado.' }, { status: 404 })
  }

  const qrCodeText = generateStaticPixPayload({
    pixKey,
    receiverName,
    receiverCity,
    amount: Number(order.totalAmount),
    txid: order.code,
  })
  const pixExpiresAt = new Date(Date.now() + 1000 * 60 * 30)

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: 'MANUAL',
      method: 'PIX',
      status: 'AWAITING_PAYMENT',
      amount: order.totalAmount,
      providerReference: order.code,
      pixQrCodeText: qrCodeText,
      pixQrCodeImageUrl: buildPixQrCodeImageUrl(qrCodeText),
      pixExpiresAt,
      rawResponse: {
        mode: 'static-brcode',
      },
      events: {
        create: {
          eventType: 'PIX_CREATED',
          nextStatus: 'AWAITING_PAYMENT',
          payload: {
            txid: order.code,
          },
        },
      },
    },
  })

  await prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      paymentStatus: 'AWAITING_PAYMENT',
    },
  })

  return NextResponse.json(
    serializePixPayment({
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
}
