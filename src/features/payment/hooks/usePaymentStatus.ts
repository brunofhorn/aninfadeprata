import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { paymentService } from '@/features/payment/services/payment.service'
import type { PaymentStatusResponse } from '@/features/payment/types/payment.types'

type PaymentStatusQueryOptions = Pick<
  UseQueryOptions<PaymentStatusResponse, Error>,
  'enabled' | 'refetchInterval'
>

export function usePaymentStatus(orderId?: string, options?: PaymentStatusQueryOptions) {
  return useQuery({
    queryKey: ['payment-status', orderId],
    queryFn: () => paymentService.getPaymentStatus(orderId!),
    enabled: options?.enabled ?? Boolean(orderId),
    refetchInterval: options?.refetchInterval ?? false,
  })
}
