import type { OrderStatus, PaymentStatus } from '@/generated/prisma/enums'
import { PAYMENT_METHODS, PAYMENT_STATUSES } from '@/types/enums'

export interface PagBankCharge {
  id: string
  reference_id?: string
  status: string
  created_at?: string
  paid_at?: string
  description?: string
  payment_response?: {
    code?: string
    message?: string
    reference?: string
  }
  payment_method?: {
    type?: string
    installments?: number
    soft_descriptor?: string
    card?: {
      brand?: string
      first_digits?: string
      last_digits?: string
      exp_month?: string
      exp_year?: string
      holder?: {
        name?: string
        tax_id?: string
      }
    }
  }
}

export interface PagBankOrderResponse {
  id: string
  reference_id?: string
  created_at?: string
  charges?: PagBankCharge[]
}

export function getChargeFromOrderPayload(payload: unknown) {
  if (!payload || typeof payload !== 'object' || !('charges' in payload)) {
    return null
  }

  const charges = (payload as PagBankOrderResponse).charges

  if (!Array.isArray(charges) || charges.length === 0) {
    return null
  }

  return charges[0] ?? null
}

interface MappedPagBankStatus {
  dbPaymentStatus: PaymentStatus
  frontendPaymentStatus: keyof typeof PAYMENT_STATUSES
  dbOrderStatus: OrderStatus
}

export function mapPagBankChargeStatus(status?: string): MappedPagBankStatus {
  switch (status) {
    case 'PAID':
      return {
        dbPaymentStatus: 'PAID',
        frontendPaymentStatus: PAYMENT_STATUSES.PAID,
        dbOrderStatus: 'PAID',
      }
    case 'AUTHORIZED':
      return {
        dbPaymentStatus: 'AUTHORIZED',
        frontendPaymentStatus: PAYMENT_STATUSES.PENDING,
        dbOrderStatus: 'PROCESSING',
      }
    case 'WAITING':
      return {
        dbPaymentStatus: 'AWAITING_PAYMENT',
        frontendPaymentStatus: PAYMENT_STATUSES.AWAITING_PAYMENT,
        dbOrderStatus: 'PENDING_PAYMENT',
      }
    case 'CANCELED':
      return {
        dbPaymentStatus: 'CANCELLED',
        frontendPaymentStatus: PAYMENT_STATUSES.CANCELLED,
        dbOrderStatus: 'CANCELLED',
      }
    case 'DECLINED':
      return {
        dbPaymentStatus: 'FAILED',
        frontendPaymentStatus: PAYMENT_STATUSES.FAILED,
        dbOrderStatus: 'CANCELLED',
      }
    case 'IN_ANALYSIS':
      return {
        dbPaymentStatus: 'PENDING',
        frontendPaymentStatus: PAYMENT_STATUSES.PENDING,
        dbOrderStatus: 'PENDING_PAYMENT',
      }
    default:
      return {
        dbPaymentStatus: 'PENDING',
        frontendPaymentStatus: PAYMENT_STATUSES.PENDING,
        dbOrderStatus: 'PENDING_PAYMENT',
      }
  }
}

export function mapPagBankMethod(type?: string) {
  if (type === 'CREDIT_CARD') {
    return PAYMENT_METHODS.CREDIT_CARD
  }

  return PAYMENT_METHODS.PIX
}
