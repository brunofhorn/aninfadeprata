import { z } from 'zod'
import type { ProductVariant } from '@/features/catalog/types/catalog.types'
import type { PaymentMethod } from '@/types/enums'
import { PAYMENT_METHODS } from '@/types/enums'
import { onlyDigits } from '@/utils/masks'

const customerSchema = z.object({
  fullName: z.string().min(3, 'Informe o nome completo.'),
  email: z.string().email('Informe um email valido.'),
  phone: z.string().min(14, 'Informe um telefone valido.'),
  cpf: z
    .string()
    .transform(onlyDigits)
    .refine((value) => value.length === 11, 'Informe um CPF valido.'),
})

const addressSchema = z.object({
  zipCode: z.string().min(9, 'Informe o CEP.'),
  street: z.string().min(3, 'Informe a rua.'),
  number: z.string().min(1, 'Informe o numero.'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Informe o bairro.'),
  city: z.string().min(2, 'Informe a cidade.'),
  state: z.string().length(2, 'Use a sigla do estado.'),
})

const cardSchema = z.object({
  holderName: z.string().min(3, 'Informe o nome impresso no cartao.'),
  holderCpf: z.string().min(14, 'Informe o CPF do titular.'),
  cardNumber: z.string().min(19, 'Informe o numero do cartao.'),
  expiry: z.string().min(5, 'Informe a validade.'),
  cvv: z.string().min(3, 'Informe o CVV.'),
  installments: z.coerce.number().min(1).max(6),
})

export function createCheckoutSchema(
  selectedProduct: ProductVariant | null,
  activePaymentMethod?: PaymentMethod,
) {
  return z
    .object({
      customer: customerSchema,
      shippingAddress: addressSchema.partial().optional(),
      paymentMethod: z.enum([PAYMENT_METHODS.PIX, PAYMENT_METHODS.CREDIT_CARD]),
      autographMessage: z.string().max(140, 'Use no maximo 140 caracteres.').optional(),
      giftWrap: z.boolean().optional(),
      card: cardSchema.partial().optional(),
    })
    .superRefine((values, ctx) => {
      const effectivePaymentMethod = activePaymentMethod ?? values.paymentMethod

      if (selectedProduct?.shippingRequired) {
        const addressResult = addressSchema.safeParse(values.shippingAddress)

        if (!addressResult.success) {
          addressResult.error.issues.forEach((issue) => {
            ctx.addIssue({
              code: 'custom',
              path: ['shippingAddress', ...(issue.path ?? [])],
              message: issue.message,
            })
          })
        }
      }

      if (effectivePaymentMethod === PAYMENT_METHODS.CREDIT_CARD) {
        const cardResult = cardSchema.safeParse(values.card)

        if (!cardResult.success) {
          cardResult.error.issues.forEach((issue) => {
            ctx.addIssue({
              code: 'custom',
              path: ['card', ...(issue.path ?? [])],
              message: issue.message,
            })
          })
        }
      }
    })
}
