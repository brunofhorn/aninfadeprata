import { NextResponse } from 'next/server'
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
      customer: {
        include: {
          addresses: true,
        },
      },
      items: {
        include: {
          productVariant: true,
        },
      },
      payments: {
        include: {
          events: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      shippingAddress: true,
    },
  })

  if (!order) {
    return NextResponse.json({ message: 'Pedido nao encontrado.' }, { status: 404 })
  }

  return NextResponse.json({
    id: order.id,
    code: order.code,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    status: order.status,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    totals: {
      subtotalAmount: Number(order.subtotalAmount),
      discountAmount: Number(order.discountAmount),
      shippingAmount: Number(order.shippingAmount),
      totalAmount: Number(order.totalAmount),
    },
    customer: {
      id: order.customer.id,
      fullName: order.customer.fullName,
      email: order.customer.email,
      phone: order.customer.phone,
      cpf: order.customer.cpf,
      addresses: order.customer.addresses.map((address) => ({
        id: address.id,
        label: address.label,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        street: address.street,
        number: address.number,
      })),
    },
    shippingAddress: order.shippingAddress
      ? {
          recipientName: order.shippingAddress.recipientName,
          zipCode: order.shippingAddress.zipCode,
          street: order.shippingAddress.street,
          number: order.shippingAddress.number,
          complement: order.shippingAddress.complement,
          neighborhood: order.shippingAddress.neighborhood,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
        }
      : null,
    items: order.items.map((item) => ({
      id: item.id,
      title: item.title,
      sku: item.sku,
      quantity: item.quantity,
      productType: item.productType,
      unitPriceAmount: Number(item.unitPriceAmount),
      totalPriceAmount: Number(item.totalPriceAmount),
      shippingRequired: item.shippingRequired,
      autographAvailable: item.autographAvailable,
      variant: item.productVariant
        ? {
            id: item.productVariant.id,
            slug: item.productVariant.slug,
            name: item.productVariant.name,
          }
        : null,
    })),
    payments: order.payments.map((payment) => ({
      id: payment.id,
      provider: payment.provider,
      method: payment.method,
      status: payment.status,
      amount: Number(payment.amount),
      installments: payment.installments,
      paidAt: payment.paidAt?.toISOString(),
      failureReason: payment.failureReason,
      pixExpiresAt: payment.pixExpiresAt?.toISOString(),
      createdAt: payment.createdAt.toISOString(),
      events: payment.events.map((event) => ({
        id: event.id,
        eventType: event.eventType,
        previousStatus: event.previousStatus,
        nextStatus: event.nextStatus,
        createdAt: event.createdAt.toISOString(),
      })),
    })),
  })
}
