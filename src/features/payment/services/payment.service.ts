import { checkoutService } from '@/features/checkout/services/checkout.service'
import type { CardPaymentPayload, PaymentStatusResponse, PixPaymentResponse } from '@/features/payment/types/payment.types'
import { buildPixQrCodeImageUrl, generateStaticPixPayload } from '@/features/payment/utils/pix'
import { API_ENDPOINTS } from '@/integrations/api/endpoints'
import { api } from '@/integrations/api/axios'
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

    const order = await checkoutService.getOrderById(orderId)

    if (!order) {
      throw new Error('Pedido nao encontrado para gerar o Pix.')
    }

    const pixKey = process.env.NEXT_PUBLIC_PIX_KEY?.trim()

    if (!pixKey) {
      throw new Error('A chave Pix nao foi configurada no ambiente.')
    }

    const receiverName = process.env.NEXT_PUBLIC_PIX_RECEIVER_NAME?.trim() || 'SARA BORGES'
    const receiverCity = process.env.NEXT_PUBLIC_PIX_RECEIVER_CITY?.trim() || 'SAO JOSE'
    const paymentId = crypto.randomUUID()
    const current = getPayments()
    const qrCodeText = generateStaticPixPayload({
      pixKey,
      receiverName,
      receiverCity,
      amount: order.total,
      txid: order.code,
    })

    savePayments([
      {
        orderId,
        paymentId,
        method: PAYMENT_METHODS.PIX,
        createdAt: new Date().toISOString(),
        status: PAYMENT_STATUSES.AWAITING_PAYMENT,
      },
      ...current.filter((item) => item.orderId !== orderId),
    ])

    return {
      paymentId,
      paymentMethod: PAYMENT_METHODS.PIX,
      status: PAYMENT_STATUSES.AWAITING_PAYMENT,
      qrCodeText,
      qrCodeImageUrl: buildPixQrCodeImageUrl(qrCodeText),
    }
  },

  async payWithCard(payload: CardPaymentPayload): Promise<PaymentStatusResponse> {
    const pagBankPublicKey = process.env.NEXT_PUBLIC_PAGBANK_PUBLIC_KEY?.trim()

    if (pagBankPublicKey) {
      const response = await api.post<PaymentStatusResponse>(
        API_ENDPOINTS.createCardPayment(payload.orderId),
        {
          encrypted_card: payload.encryptedCard,
          installments: payload.installments,
          holder_name: payload.holderName,
          holder_cpf: payload.holderCpf,
        },
      )

      const order = await checkoutService.getOrderById(payload.orderId)

      if (order) {
        checkoutService.updateOrder({
          ...order,
          paymentStatus: response.data.status,
        })
      }

      return response.data
    }

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

    return {
      orderId,
      paymentId: payment.paymentId,
      method: payment.method,
      status: payment.status,
    }
  },
}
