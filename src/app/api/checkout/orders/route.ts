import { NextResponse } from 'next/server'
import { serializeOrder } from '@/server/checkout/mappers'
import { createOrderSchema } from '@/server/checkout/schemas'
import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'

export const runtime = 'nodejs'

function generateOrderCode() {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `ANP-${timestamp}${random}`
}

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: 'DATABASE_URL nao configurada. Execute as migrations antes do checkout.' },
      { status: 503 },
    )
  }

  try {
    const payload = createOrderSchema.parse(await request.json())
    const prisma = getPrismaClient()

    const product = await prisma.productVariant.findFirst({
      where: {
        id: payload.productVariantId,
        isActive: true,
      },
    })

    if (!product) {
      return NextResponse.json({ message: 'Produto nao encontrado.' }, { status: 404 })
    }

    if (product.shippingRequired && !payload.shippingAddress) {
      return NextResponse.json(
        { message: 'Endereco de entrega obrigatorio para esta edicao.' },
        { status: 400 },
      )
    }

    const customer = await prisma.customer.upsert({
      where: {
        email: payload.customer.email,
      },
      update: {
        fullName: payload.customer.fullName,
        phone: payload.customer.phone,
        cpf: payload.customer.cpf,
      },
      create: {
        email: payload.customer.email,
        fullName: payload.customer.fullName,
        phone: payload.customer.phone,
        cpf: payload.customer.cpf,
      },
    })

    const totalAmount = product.priceAmount

    const createdOrder = await prisma.order.create({
      data: {
        code: generateOrderCode(),
        customerId: customer.id,
        subtotalAmount: totalAmount,
        totalAmount: totalAmount,
        itemCount: 1,
        giftWrap: payload.giftWrap ?? false,
        autographMessage: payload.autographMessage,
        items: {
          create: {
            productVariantId: product.id,
            sku: product.sku,
            title: product.name,
            productType: product.type,
            quantity: 1,
            unitPriceAmount: totalAmount,
            totalPriceAmount: totalAmount,
            shippingRequired: product.shippingRequired,
            autographAvailable: product.autographAvailable,
          },
        },
        shippingAddress: payload.shippingAddress
          ? {
              create: {
                recipientName: payload.customer.fullName,
                zipCode: payload.shippingAddress.zipCode,
                street: payload.shippingAddress.street,
                number: payload.shippingAddress.number,
                complement: payload.shippingAddress.complement,
                neighborhood: payload.shippingAddress.neighborhood,
                city: payload.shippingAddress.city,
                state: payload.shippingAddress.state,
              },
            }
          : undefined,
      },
      include: {
        customer: true,
        items: true,
        shippingAddress: true,
      },
    })

    return NextResponse.json({
      order: serializeOrder(createdOrder, payload.paymentMethod),
      nextAction:
        payload.paymentMethod === 'PIX' ? 'SHOW_PIX' : 'WAITING_CONFIRMATION',
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Nao foi possivel criar o pedido.' },
      { status: 500 },
    )
  }
}
