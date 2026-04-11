export const PAYMENT_STATUS_LABELS = {
  PENDING: 'Pendente',
  AWAITING_PAYMENT: 'Aguardando pagamento',
  PAID: 'Pago',
  FAILED: 'Falhou',
  EXPIRED: 'Expirado',
  CANCELLED: 'Cancelado',
} as const

export const PAYMENT_POLLING_INTERVAL = 5000
