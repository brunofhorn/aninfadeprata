import type { PaymentMethod, PaymentStatus } from '@/types/enums'
import type { Order } from '@/features/checkout/types/checkout.types'

export interface CheckoutResponse {
  order: Order
  nextAction: 'SHOW_PIX' | 'WAITING_CONFIRMATION' | 'REDIRECT_SUCCESS'
}

export interface PixPaymentResponse {
  paymentId: string
  paymentMethod: PaymentMethod
  status: PaymentStatus
  qrCodeText: string
  qrCodeImageUrl: string
  expiresAt: string
}

export interface CardPaymentPayload {
  orderId: string
  cardToken: string
  installments: number
  holderName: string
  holderCpf: string
}

export interface PaymentStatusResponse {
  orderId: string
  paymentId: string
  method: PaymentMethod
  status: PaymentStatus
  paidAt?: string
}
