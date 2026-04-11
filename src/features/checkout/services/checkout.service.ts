import type { ProductVariant } from '@/features/catalog/types/catalog.types'
import type { Address, CheckoutFormData, Order } from '@/features/checkout/types/checkout.types'
import { PAYMENT_STATUSES } from '@/types/enums'
import { getSessionItem, setSessionItem } from '@/utils/storage'

const ORDER_STORAGE_KEY = 'book-orders'
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function getOrders() {
  return getSessionItem<Order[]>(ORDER_STORAGE_KEY, [])
}

function saveOrders(orders: Order[]) {
  setSessionItem(ORDER_STORAGE_KEY, orders)
}

export const checkoutService = {
  async createOrder(input: CheckoutFormData, product: ProductVariant): Promise<Order> {
    await sleep(650)

    const order: Order = {
      id: crypto.randomUUID(),
      code: `ANP-${Math.random().toString().slice(2, 8)}`,
      customer: input.customer,
      shippingAddress: product.shippingRequired
        ? (input.shippingAddress as Address | undefined)
        : undefined,
      item: {
        productVariantId: product.id,
        title: product.name,
        quantity: 1,
        unitPrice: product.price,
      },
      total: product.price,
      paymentMethod: input.paymentMethod,
      paymentStatus: PAYMENT_STATUSES.PENDING,
      createdAt: new Date().toISOString(),
    }

    saveOrders([order, ...getOrders()])
    return order
  },

  async getOrderById(orderId: string) {
    await sleep(150)
    return getOrders().find((order) => order.id === orderId) ?? null
  },

  updateOrder(updatedOrder: Order) {
    const nextOrders = getOrders().map((order) =>
      order.id === updatedOrder.id ? updatedOrder : order,
    )

    saveOrders(nextOrders)
  },
}
