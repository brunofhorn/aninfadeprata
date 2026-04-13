import type {
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

  async payWithCard(payload: CardPaymentPayload): Promise<PaymentStatusResponse> {
    const response = await api.post<PaymentStatusResponse>(
      API_ENDPOINTS.createCardPayment(payload.orderId),
      {
        encrypted_card: payload.encryptedCard,
        installments: payload.installments,
        holder_name: payload.holderName,
        holder_cpf: payload.holderCpf,
      },
    )

    return response.data
  },

  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    const response = await api.get<PaymentStatusResponse>(API_ENDPOINTS.paymentStatus(orderId))
    return response.data
  },
}
