import { NextResponse } from 'next/server'
import type { Prisma } from '@/generated/prisma/client'
import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: 'DATABASE_URL nao configurada.' },
      { status: 503 },
    )
  }

  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') ?? '1')
  const pageSize = Math.min(Number(url.searchParams.get('pageSize') ?? '20'), 100)
  const status = url.searchParams.get('status')?.trim()
  const paymentStatus = url.searchParams.get('paymentStatus')?.trim()
  const search = url.searchParams.get('search')?.trim()
  const skip = (page - 1) * pageSize
  const prisma = getPrismaClient()

  const where: Prisma.OrderWhereInput = {}

  if (status) {
    where.status = status as never
  }

  if (paymentStatus) {
    where.paymentStatus = paymentStatus as never
  }

  if (search) {
    where.OR = [
      { code: { contains: search, mode: 'insensitive' } },
      {
        customer: {
          is: {
            fullName: { contains: search, mode: 'insensitive' },
          },
        },
      },
      {
        customer: {
          is: {
            email: { contains: search, mode: 'insensitive' },
          },
        },
      },
    ]
  }

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: {
        customer: true,
        items: true,
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: pageSize,
    }),
  ])

  return NextResponse.json({
    data: orders.map((order) => ({
      id: order.id,
      code: order.code,
      createdAt: order.createdAt.toISOString(),
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: Number(order.totalAmount),
      itemCount: order.itemCount,
      customer: {
        name: order.customer.fullName,
        email: order.customer.email,
        cpf: order.customer.cpf,
        phone: order.customer.phone,
      },
      items: order.items.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unitPriceAmount: Number(item.unitPriceAmount),
      })),
      latestPayment: order.payments[0]
        ? {
            id: order.payments[0].id,
            method: order.payments[0].method,
            status: order.payments[0].status,
            paidAt: order.payments[0].paidAt?.toISOString(),
          }
        : null,
    })),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  })
}
