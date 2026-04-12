import { useQuery } from '@tanstack/react-query'
import { paymentService } from '@/features/payment/services/payment.service'

export function usePaymentStatus(orderId?: string) {
  return useQuery({
    queryKey: ['payment-status', orderId],
    queryFn: () => paymentService.getPaymentStatus(orderId!),
    enabled: Boolean(orderId),
    refetchInterval: false,
  })
}
