import { z } from 'zod'
import { PAYMENT_METHODS } from '@/types/enums'

const customerSchema = z.object({
  fullName: z.string().trim().min(2, 'Informe o nome completo.'),
  email: z.email('Informe um e-mail valido.'),
  phone: z.string().trim().min(8, 'Informe o telefone.'),
  cpf: z.string().trim().min(11, 'Informe o CPF.'),
})

const shippingAddressSchema = z.object({
  zipCode: z.string().trim().min(8, 'Informe o CEP.'),
  street: z.string().trim().min(2, 'Informe a rua.'),
  number: z.string().trim().min(1, 'Informe o numero.'),
  complement: z.string().trim().optional(),
  neighborhood: z.string().trim().min(2, 'Informe o bairro.'),
  city: z.string().trim().min(2, 'Informe a cidade.'),
  state: z.string().trim().min(2, 'Informe o estado.'),
})

export const createOrderSchema = z.object({
  productVariantId: z.string().trim().min(1, 'Selecione um produto.'),
  paymentMethod: z.enum([PAYMENT_METHODS.PIX, PAYMENT_METHODS.CREDIT_CARD]),
  customer: customerSchema,
  shippingAddress: shippingAddressSchema.optional(),
  autographMessage: z.string().trim().optional(),
  giftWrap: z.boolean().optional(),
})

export const createCardPaymentSchema = z.object({
  encrypted_card: z.string().trim().min(1, 'Cartao criptografado ausente.'),
  installments: z.number().int().min(1).max(12).default(1),
  holder_name: z.string().trim().min(2, 'Informe o nome impresso no cartao.'),
  holder_cpf: z.string().trim().min(11, 'Informe o CPF do titular.'),
})
