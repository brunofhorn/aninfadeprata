import { NextResponse } from 'next/server'
import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'

export const runtime = 'nodejs'

function startOfDay(date: Date) {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function endOfDay(date: Date) {
  const copy = new Date(date)
  copy.setHours(23, 59, 59, 999)
  return copy
}

export async function GET(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: 'DATABASE_URL nao configurada.' },
      { status: 503 },
    )
  }

  const url = new URL(request.url)
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')
  const now = new Date()
  const rangeStart = from
    ? startOfDay(new Date(from))
    : startOfDay(new Date(now.getFullYear(), now.getMonth(), 1))
  const rangeEnd = to ? endOfDay(new Date(to)) : endOfDay(now)
  const prisma = getPrismaClient()

  const [ordersInRange, paidOrders, paymentsInRange] = await Promise.all([
    prisma.order.findMany({
      where: {
        createdAt: {
          gte: rangeStart,
          lte: rangeEnd,
        },
      },
      include: {
        items: true,
      },
    }),
    prisma.order.findMany({
      where: {
        createdAt: {
          gte: rangeStart,
          lte: rangeEnd,
        },
        paymentStatus: 'PAID',
      },
      include: {
        items: true,
      },
    }),
    prisma.payment.findMany({
      where: {
        createdAt: {
          gte: rangeStart,
          lte: rangeEnd,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ])

  const grossRevenue = paidOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
  const averageTicket = paidOrders.length > 0 ? grossRevenue / paidOrders.length : 0
  const pendingPayments = ordersInRange.filter(
    (order) => order.paymentStatus === 'PENDING' || order.paymentStatus === 'AWAITING_PAYMENT',
  ).length

  const paymentMethods = paymentsInRange.reduce<Record<string, { count: number; amount: number }>>(
    (acc, payment) => {
      const current = acc[payment.method] ?? { count: 0, amount: 0 }
      acc[payment.method] = {
        count: current.count + 1,
        amount: current.amount + Number(payment.amount),
      }
      return acc
    },
    {},
  )

  const topProductsMap = paidOrders.flatMap((order) => order.items).reduce<
    Record<string, { title: string; quantity: number; revenue: number }>
  >((acc, item) => {
    const current = acc[item.title] ?? { title: item.title, quantity: 0, revenue: 0 }
    acc[item.title] = {
      title: item.title,
      quantity: current.quantity + item.quantity,
      revenue: current.revenue + Number(item.totalPriceAmount),
    }
    return acc
  }, {})

  return NextResponse.json({
    period: {
      from: rangeStart.toISOString(),
      to: rangeEnd.toISOString(),
    },
    kpis: {
      totalOrders: ordersInRange.length,
      paidOrders: paidOrders.length,
      pendingPayments,
      grossRevenue,
      averageTicket,
      conversionRate: ordersInRange.length > 0 ? paidOrders.length / ordersInRange.length : 0,
    },
    paymentMethods: Object.entries(paymentMethods).map(([method, values]) => ({
      method,
      count: values.count,
      amount: values.amount,
    })),
    topProducts: Object.values(topProductsMap)
      .sort((left, right) => right.revenue - left.revenue)
      .slice(0, 5),
  })
}
