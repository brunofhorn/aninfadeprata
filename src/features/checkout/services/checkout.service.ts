import type { ProductVariant } from '@/features/catalog/types/catalog.types'
import type { Address, CheckoutFormData, Order } from '@/features/checkout/types/checkout.types'
import type { CheckoutResponse } from '@/features/payment/types/payment.types'
import { API_ENDPOINTS } from '@/integrations/api/endpoints'
import { api } from '@/integrations/api/axios'

export const checkoutService = {
  async createOrder(input: CheckoutFormData, product: ProductVariant): Promise<Order> {
    const response = await api.post<CheckoutResponse>(API_ENDPOINTS.createOrder, {
      productVariantId: product.id,
      paymentMethod: input.paymentMethod,
      customer: input.customer,
      shippingAddress: product.shippingRequired
        ? (input.shippingAddress as Address | undefined)
        : undefined,
      autographMessage: input.autographMessage,
      giftWrap: input.giftWrap ?? false,
    })

    return response.data.order
  },

  async getOrderById(orderId: string) {
    const response = await api.get<Order>(API_ENDPOINTS.getOrder(orderId))
    return response.data
  },
}
