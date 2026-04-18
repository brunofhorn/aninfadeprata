import type { OrderStatus, PaymentStatus } from '@/generated/prisma/enums'
import { PAYMENT_METHODS, PAYMENT_STATUSES } from '@/types/enums'

export interface MercadoPagoPreferenceResponse {
  id: string
  init_point?: string
  sandbox_init_point?: string
}

export interface MercadoPagoPayment {
  id: number | string
  external_reference?: string
  status?: string
  status_detail?: string
  date_created?: string
  date_approved?: string
  payment_type_id?: string
  payment_method_id?: string
  installments?: number
  card?: {
    first_six_digits?: string
    last_four_digits?: string
  }
}

export interface MercadoPagoPaymentSearchResponse {
  results?: MercadoPagoPayment[]
}

interface MappedMercadoPagoStatus {
  dbPaymentStatus: PaymentStatus
  frontendPaymentStatus: keyof typeof PAYMENT_STATUSES
  dbOrderStatus: OrderStatus
}

export function getMercadoPagoRedirectUrl(preference: MercadoPagoPreferenceResponse) {
  if (process.env.NODE_ENV !== 'production' && preference.sandbox_init_point) {
    return preference.sandbox_init_point
  }

  return preference.init_point ?? preference.sandbox_init_point ?? null
}

export function mapMercadoPagoPaymentStatus(
  status?: string,
  statusDetail?: string,
): MappedMercadoPagoStatus {
  switch (status) {
    case 'approved':
      return {
        dbPaymentStatus:
          statusDetail === 'partially_refunded' ? 'PARTIALLY_REFUNDED' : 'PAID',
        frontendPaymentStatus:
          statusDetail === 'partially_refunded'
            ? PAYMENT_STATUSES.PARTIALLY_REFUNDED
            : PAYMENT_STATUSES.PAID,
        dbOrderStatus: 'PAID',
      }
    case 'authorized':
      return {
        dbPaymentStatus: 'AUTHORIZED',
        frontendPaymentStatus: PAYMENT_STATUSES.PENDING,
        dbOrderStatus: 'PROCESSING',
      }
    case 'pending':
      return {
        dbPaymentStatus: 'AWAITING_PAYMENT',
        frontendPaymentStatus: PAYMENT_STATUSES.AWAITING_PAYMENT,
        dbOrderStatus: 'PENDING_PAYMENT',
      }
    case 'in_process':
      return {
        dbPaymentStatus: 'PENDING',
        frontendPaymentStatus: PAYMENT_STATUSES.PENDING,
        dbOrderStatus: 'PENDING_PAYMENT',
      }
    case 'in_mediation':
      return {
        dbPaymentStatus: 'CHARGEBACK',
        frontendPaymentStatus: PAYMENT_STATUSES.CHARGEBACK,
        dbOrderStatus: 'PAID',
      }
    case 'rejected':
      return {
        dbPaymentStatus: 'FAILED',
        frontendPaymentStatus: PAYMENT_STATUSES.FAILED,
        dbOrderStatus: 'CANCELLED',
      }
    case 'cancelled':
    case 'canceled':
      return {
        dbPaymentStatus: 'CANCELLED',
        frontendPaymentStatus: PAYMENT_STATUSES.CANCELLED,
        dbOrderStatus: 'CANCELLED',
      }
    case 'refunded':
      return {
        dbPaymentStatus: 'REFUNDED',
        frontendPaymentStatus: PAYMENT_STATUSES.REFUNDED,
        dbOrderStatus: 'REFUNDED',
      }
    case 'charged_back':
      return {
        dbPaymentStatus: 'CHARGEBACK',
        frontendPaymentStatus: PAYMENT_STATUSES.CHARGEBACK,
        dbOrderStatus: 'REFUNDED',
      }
    default:
      return {
        dbPaymentStatus: 'PENDING',
        frontendPaymentStatus: PAYMENT_STATUSES.PENDING,
        dbOrderStatus: 'PENDING_PAYMENT',
      }
  }
}

export function mapMercadoPagoMethod(type?: string) {
  if (type === 'credit_card') {
    return PAYMENT_METHODS.CREDIT_CARD
  }

  if (type === 'bank_transfer') {
    return PAYMENT_METHODS.PIX
  }

  return PAYMENT_METHODS.CREDIT_CARD
}

export function normalizeMercadoPagoPaymentId(paymentId: number | string | null | undefined) {
  if (paymentId === null || paymentId === undefined) {
    return null
  }

  return String(paymentId)
}
