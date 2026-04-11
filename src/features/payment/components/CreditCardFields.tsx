import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import type { CheckoutFormData } from '@/features/checkout/types/checkout.types'
import { formatCpf } from '@/utils/masks'

interface CreditCardFieldsProps {
  register: UseFormRegister<CheckoutFormData>
  setValue: UseFormSetValue<CheckoutFormData>
  errors: FieldErrors<CheckoutFormData>
}

export function CreditCardFields({
  register,
  setValue,
  errors,
}: CreditCardFieldsProps) {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <Input
        id="holderName"
        label="Nome do titular"
        error={errors.card?.holderName?.message}
        placeholder="Nome impresso no cartao"
        {...register('card.holderName')}
      />
      <Input
        id="holderCpf"
        label="CPF do titular"
        error={errors.card?.holderCpf?.message}
        placeholder="000.000.000-00"
        {...register('card.holderCpf', {
          onChange: (event) => setValue('card.holderCpf', formatCpf(event.target.value)),
        })}
      />
      <Input
        id="cardNumber"
        label="Numero do cartao"
        error={errors.card?.cardNumber?.message}
        placeholder="0000 0000 0000 0000"
        {...register('card.cardNumber')}
      />
      <Input
        id="expiry"
        label="Validade"
        error={errors.card?.expiry?.message}
        placeholder="12/29"
        {...register('card.expiry')}
      />
      <Input
        id="cvv"
        label="CVV"
        error={errors.card?.cvv?.message}
        placeholder="123"
        {...register('card.cvv')}
      />
      <Input
        id="installments"
        label="Parcelas"
        error={errors.card?.installments?.message}
        max={6}
        min={1}
        placeholder="1"
        type="number"
        {...register('card.installments', { valueAsNumber: true })}
      />
    </div>
  )
}
