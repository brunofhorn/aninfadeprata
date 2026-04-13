export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(value: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(value)
}

export function getStatusBadgeTone(status: string) {
  switch (status) {
    case 'PAID':
    case 'FULFILLED':
    case 'DELIVERED':
      return 'border-nymph-400/30 bg-nymph-400/10 text-nymph-300'
    case 'PENDING':
    case 'PENDING_PAYMENT':
    case 'AWAITING_PAYMENT':
    case 'PROCESSING':
      return 'border-silver-300/20 bg-silver-300/10 text-silver-200'
    case 'FAILED':
    case 'CANCELLED':
    case 'REFUNDED':
      return 'border-red-400/30 bg-red-500/10 text-red-200'
    default:
      return 'border-white/10 bg-white/8 text-white/70'
  }
}
