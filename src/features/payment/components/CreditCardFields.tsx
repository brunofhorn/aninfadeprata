import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import type { CheckoutFormData } from '@/features/checkout/types/checkout.types'
import { formatCardExpiry, formatCardNumber, formatCpf, formatSecurityCode } from '@/utils/masks'

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
    <div className="mt-5 rounded-[24px] border border-white/8 bg-white/[0.03] p-5 sm:p-6">
      <div className="mb-4 space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-silver-300/75">
          PagBank
        </p>
        <h3 className="text-2xl text-white">Dados do cartao</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="holderName"
          label="Nome do titular"
          error={errors.card?.holderName?.message}
          placeholder="Nome impresso no cartao"
          tone="dark"
          {...register('card.holderName')}
        />
        <Input
          id="holderCpf"
          label="CPF do titular"
          error={errors.card?.holderCpf?.message}
          placeholder="000.000.000-00"
          tone="dark"
          {...register('card.holderCpf', {
            onChange: (event) => setValue('card.holderCpf', formatCpf(event.target.value)),
          })}
        />
        <Input
          id="cardNumber"
          label="Numero do cartao"
          error={errors.card?.cardNumber?.message}
          placeholder="0000 0000 0000 0000"
          tone="dark"
          {...register('card.cardNumber', {
            onChange: (event) => setValue('card.cardNumber', formatCardNumber(event.target.value)),
          })}
        />
        <Input
          id="expiry"
          label="Validade"
          error={errors.card?.expiry?.message}
          placeholder="12/29"
          tone="dark"
          {...register('card.expiry', {
            onChange: (event) => setValue('card.expiry', formatCardExpiry(event.target.value)),
          })}
        />
        <Input
          id="cvv"
          label="CVV"
          error={errors.card?.cvv?.message}
          placeholder="123"
          inputMode="numeric"
          tone="dark"
          {...register('card.cvv', {
            onChange: (event) => setValue('card.cvv', formatSecurityCode(event.target.value)),
          })}
        />
        <Input
          id="installments"
          label="Parcelas"
          error={errors.card?.installments?.message}
          max={6}
          min={1}
          placeholder="1"
          tone="dark"
          type="number"
          {...register('card.installments', { valueAsNumber: true })}
        />
      </div>
    </div>
  )
}
