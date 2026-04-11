import { checkoutService } from '@/features/checkout/services/checkout.service'
import type { CardPaymentPayload, PaymentStatusResponse, PixPaymentResponse } from '@/features/payment/types/payment.types'
import { PAYMENT_METHODS, PAYMENT_STATUSES } from '@/types/enums'
import { getSessionItem, setSessionItem } from '@/utils/storage'

interface StoredPayment {
  orderId: string
  paymentId: string
  method: keyof typeof PAYMENT_METHODS
  createdAt: string
  expiresAt?: string
  status: keyof typeof PAYMENT_STATUSES
}

const PAYMENT_STORAGE_KEY = 'book-payments'
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function getPayments() {
  return getSessionItem<StoredPayment[]>(PAYMENT_STORAGE_KEY, [])
}

function savePayments(payments: StoredPayment[]) {
  setSessionItem(PAYMENT_STORAGE_KEY, payments)
}

export const paymentService = {
  async createPixPayment(orderId: string): Promise<PixPaymentResponse> {
    await sleep(450)

    const paymentId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 1000 * 60 * 20).toISOString()
    const current = getPayments()

    savePayments([
      {
        orderId,
        paymentId,
        method: PAYMENT_METHODS.PIX,
        createdAt: new Date().toISOString(),
        expiresAt,
        status: PAYMENT_STATUSES.AWAITING_PAYMENT,
      },
      ...current.filter((item) => item.orderId !== orderId),
    ])

    return {
      paymentId,
      paymentMethod: PAYMENT_METHODS.PIX,
      status: PAYMENT_STATUSES.AWAITING_PAYMENT,
      qrCodeText: `00020126580014br.gov.bcb.pix0136demo-pix-${orderId.slice(0, 8)}`,
      qrCodeImageUrl:
        'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=PIX%20A%20NINFA%20DE%20PRATA',
      expiresAt,
    }
  },

  async payWithCard(payload: CardPaymentPayload): Promise<PaymentStatusResponse> {
    await sleep(900)

    const paymentId = crypto.randomUUID()
    const current = getPayments()
    savePayments([
      {
        orderId: payload.orderId,
        paymentId,
        method: PAYMENT_METHODS.CREDIT_CARD,
        createdAt: new Date().toISOString(),
        status: PAYMENT_STATUSES.PAID,
      },
      ...current.filter((item) => item.orderId !== payload.orderId),
    ])

    const order = await checkoutService.getOrderById(payload.orderId)

    if (order) {
      checkoutService.updateOrder({
        ...order,
        paymentStatus: PAYMENT_STATUSES.PAID,
      })
    }

    return {
      orderId: payload.orderId,
      paymentId,
      method: PAYMENT_METHODS.CREDIT_CARD,
      status: PAYMENT_STATUSES.PAID,
      paidAt: new Date().toISOString(),
    }
  },

  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    await sleep(200)

    const payment = getPayments().find((item) => item.orderId === orderId)

    if (!payment) {
      throw new Error('Pagamento nao encontrado.')
    }

    let nextStatus = payment.status

    if (
      payment.method === PAYMENT_METHODS.PIX &&
      payment.status === PAYMENT_STATUSES.AWAITING_PAYMENT
    ) {
      const createdAt = new Date(payment.createdAt).getTime()
      const elapsed = Date.now() - createdAt

      if (elapsed >= 15000) {
        nextStatus = PAYMENT_STATUSES.PAID
      }
    }

    if (payment.expiresAt && new Date(payment.expiresAt).getTime() < Date.now()) {
      nextStatus = PAYMENT_STATUSES.EXPIRED
    }

    if (nextStatus !== payment.status) {
      const nextPayment = { ...payment, status: nextStatus }
      savePayments(getPayments().map((item) => (item.orderId === orderId ? nextPayment : item)))

      const order = await checkoutService.getOrderById(orderId)
      if (order) {
        checkoutService.updateOrder({
          ...order,
          paymentStatus: nextStatus,
        })
      }
    }

    return {
      orderId,
      paymentId: payment.paymentId,
      method: payment.method,
      status: nextStatus,
      paidAt: nextStatus === PAYMENT_STATUSES.PAID ? new Date().toISOString() : undefined,
    }
  },
}
