import type { Order as CheckoutOrder } from '@/features/checkout/types/checkout.types'
import type {
  PaymentStatusResponse,
  PixPaymentResponse,
} from '@/features/payment/types/payment.types'
import { PAYMENT_METHODS, PAYMENT_STATUSES } from '@/types/enums'

type OrderRecord = {
  id: string
  code: string
  paymentStatus: string
  createdAt: Date
  customer: {
    fullName: string
    email: string
    phone: string | null
    cpf: string | null
  }
  items: Array<{
    productVariantId: string | null
    title: string
    quantity: number
    unitPriceAmount: unknown
  }>
  shippingAddress?: {
    zipCode: string
    street: string
    number: string
    complement: string | null
    neighborhood: string
    city: string
    state: string
  } | null
}

type PaymentRecord = {
  id: string
  orderId: string
  method: string
  status: string
  paidAt: Date | null
  pixQrCodeText: string | null
  pixQrCodeImageUrl: string | null
  pixExpiresAt: Date | null
}

function toNumber(value: unknown) {
  return Number(value ?? 0)
}

function normalizeFrontendPaymentStatus(status: string) {
  if (status in PAYMENT_STATUSES) {
    return status as keyof typeof PAYMENT_STATUSES
  }

  return PAYMENT_STATUSES.PENDING
}

function normalizeFrontendPaymentMethod(method?: string | null) {
  if (method === PAYMENT_METHODS.CREDIT_CARD) {
    return PAYMENT_METHODS.CREDIT_CARD
  }

  return PAYMENT_METHODS.PIX
}

export function serializeOrder(
  order: OrderRecord,
  paymentMethod: string = PAYMENT_METHODS.PIX,
): CheckoutOrder {
  const item = order.items[0]

  return {
    id: order.id,
    code: order.code,
    customer: {
      fullName: order.customer.fullName,
      email: order.customer.email,
      phone: order.customer.phone ?? '',
      cpf: order.customer.cpf ?? '',
    },
    shippingAddress: order.shippingAddress
      ? {
          zipCode: order.shippingAddress.zipCode,
          street: order.shippingAddress.street,
          number: order.shippingAddress.number,
          complement: order.shippingAddress.complement ?? undefined,
          neighborhood: order.shippingAddress.neighborhood,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
        }
      : undefined,
    item: {
      productVariantId: item?.productVariantId ?? '',
      title: item?.title ?? '',
      quantity: item?.quantity ?? 1,
      unitPrice: toNumber(item?.unitPriceAmount),
    },
    total: toNumber(item?.unitPriceAmount) * (item?.quantity ?? 1),
    paymentMethod: normalizeFrontendPaymentMethod(paymentMethod),
    paymentStatus: normalizeFrontendPaymentStatus(order.paymentStatus),
    createdAt: order.createdAt.toISOString(),
  }
}

export function serializePaymentStatus(payment: PaymentRecord): PaymentStatusResponse {
  return {
    orderId: payment.orderId,
    paymentId: payment.id,
    method: normalizeFrontendPaymentMethod(payment.method),
    status: normalizeFrontendPaymentStatus(payment.status),
    paidAt: payment.paidAt?.toISOString(),
  }
}

export function serializePixPayment(payment: PaymentRecord): PixPaymentResponse {
  return {
    paymentId: payment.id,
    paymentMethod: PAYMENT_METHODS.PIX,
    status: normalizeFrontendPaymentStatus(payment.status),
    qrCodeText: payment.pixQrCodeText ?? '',
    qrCodeImageUrl: payment.pixQrCodeImageUrl ?? '',
    expiresAt: payment.pixExpiresAt?.toISOString(),
  }
}
