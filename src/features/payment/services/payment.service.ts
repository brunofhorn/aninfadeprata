import type {
  CardPaymentResponse,
  CardPaymentPayload,
  PaymentStatusResponse,
  PixPaymentResponse,
} from '@/features/payment/types/payment.types'
import { API_ENDPOINTS } from '@/integrations/api/endpoints'
import { api } from '@/integrations/api/axios'

export const paymentService = {
  async createPixPayment(orderId: string): Promise<PixPaymentResponse> {
    const response = await api.post<PixPaymentResponse>(API_ENDPOINTS.createPixPayment(orderId))
    return response.data
  },

  async payWithCard(payload: CardPaymentPayload): Promise<CardPaymentResponse> {
    const response = await api.post<CardPaymentResponse>(
      API_ENDPOINTS.createCardPayment(payload.orderId),
      payload,
    )

    return response.data
  },

  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    const response = await api.get<PaymentStatusResponse>(API_ENDPOINTS.paymentStatus(orderId))
    return response.data
  },
}
