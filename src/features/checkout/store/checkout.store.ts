import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ProductVariant } from '@/features/catalog/types/catalog.types'
import type { CheckoutFormData, Order } from '@/features/checkout/types/checkout.types'
import type { PixPaymentResponse } from '@/features/payment/types/payment.types'
import type { PaymentMethod, PaymentStatus } from '@/types/enums'

interface CheckoutState {
  selectedProduct: ProductVariant | null
  checkoutData: Partial<CheckoutFormData>
  order: Order | null
  paymentMethod: PaymentMethod | null
  paymentStatus: PaymentStatus | null
  pixPayment: PixPaymentResponse | null
  setSelectedProduct: (product: ProductVariant) => void
  setCheckoutData: (data: Partial<CheckoutFormData>) => void
  setOrder: (order: Order) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setPaymentStatus: (status: PaymentStatus | null) => void
  setPixPayment: (payload: PixPaymentResponse | null) => void
  resetCheckout: () => void
}

const initialState = {
  selectedProduct: null,
  checkoutData: {},
  order: null,
  paymentMethod: null,
  paymentStatus: null,
  pixPayment: null,
} satisfies Pick<
  CheckoutState,
  'selectedProduct' | 'checkoutData' | 'order' | 'paymentMethod' | 'paymentStatus' | 'pixPayment'
>

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      ...initialState,
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      setCheckoutData: (data) =>
        set((state) => ({
          checkoutData: {
            ...state.checkoutData,
            ...data,
          },
        })),
      setOrder: (order) => set({ order }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setPaymentStatus: (paymentStatus) => set({ paymentStatus }),
      setPixPayment: (pixPayment) => set({ pixPayment }),
      resetCheckout: () => set(initialState),
    }),
    {
      name: 'book-checkout-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        selectedProduct: state.selectedProduct,
        checkoutData: state.checkoutData,
        order: state.order,
        paymentMethod: state.paymentMethod,
        paymentStatus: state.paymentStatus,
        pixPayment: state.pixPayment,
      }),
    },
  ),
)
