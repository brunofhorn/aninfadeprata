import { useQuery } from '@tanstack/react-query'
import { PAYMENT_POLLING_INTERVAL } from '@/constants/payment'
import { paymentService } from '@/features/payment/services/payment.service'
import { PAYMENT_STATUSES } from '@/types/enums'

export function usePaymentStatus(orderId?: string) {
  return useQuery({
    queryKey: ['payment-status', orderId],
    queryFn: () => paymentService.getPaymentStatus(orderId!),
    enabled: Boolean(orderId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status && status !== PAYMENT_STATUSES.AWAITING_PAYMENT
        ? false
        : PAYMENT_POLLING_INTERVAL
    },
  })
}
