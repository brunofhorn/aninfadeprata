import { useCheckoutStore } from '@/features/checkout/store/checkout.store'

export function useCheckout() {
  return useCheckoutStore()
}
