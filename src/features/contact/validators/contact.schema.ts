import { z } from 'zod'
import { onlyDigits } from '@/utils/masks'

export const contactSchema = z.object({
  name: z.string().min(3, 'Informe seu nome.'),
  email: z.string().email('Informe um e-mail valido.'),
  phone: z
    .string()
    .refine((value) => {
      const digits = onlyDigits(value)
      return digits.length === 10 || digits.length === 11
    }, {
      message: 'Informe um celular valido.',
    }),
  message: z
    .string()
    .min(10, 'Escreva uma mensagem com pelo menos 10 caracteres.')
    .max(1000, 'Use no maximo 1000 caracteres.'),
})
