import { NextResponse } from 'next/server'
import { serializeOrder } from '@/server/checkout/mappers'
import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'

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
    include: {
      customer: true,
      items: true,
      payments: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
      shippingAddress: true,
    },
  })

  if (!order) {
    return NextResponse.json({ message: 'Pedido nao encontrado.' }, { status: 404 })
  }

  return NextResponse.json(serializeOrder(order, order.payments[0]?.method))
}
