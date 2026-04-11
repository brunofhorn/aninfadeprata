export const PRODUCT_TYPES = {
  EPUB: 'EPUB',
  PDF: 'PDF',
  PHYSICAL: 'PHYSICAL',
  PHYSICAL_SIGNED: 'PHYSICAL_SIGNED',
  PHYSICAL_SIGNED_GIFT: 'PHYSICAL_SIGNED_GIFT',
} as const

export const PAYMENT_METHODS = {
  PIX: 'PIX',
  CREDIT_CARD: 'CREDIT_CARD',
} as const

export const PAYMENT_STATUSES = {
  PENDING: 'PENDING',
  AWAITING_PAYMENT: 'AWAITING_PAYMENT',
  PAID: 'PAID',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
} as const

export type ProductType = (typeof PRODUCT_TYPES)[keyof typeof PRODUCT_TYPES]
export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS]
export type PaymentStatus = (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES]
