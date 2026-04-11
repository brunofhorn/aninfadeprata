import { FiCreditCard, FiSmartphone } from 'react-icons/fi'
import { cn } from '@/utils/cn'
import type { PaymentMethod } from '@/types/enums'
import { PAYMENT_METHODS } from '@/types/enums'

interface PaymentMethodSelectorProps {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

export function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <button
        className={cn(
          'rounded-[24px] border p-5 text-left',
          value === PAYMENT_METHODS.PIX
            ? 'border-brand-900 bg-brand-100'
            : 'border-brand-200 bg-white',
        )}
        type="button"
        onClick={() => onChange(PAYMENT_METHODS.PIX)}
      >
        <FiSmartphone className="text-xl text-brand-700" />
        <p className="mt-3 text-lg font-semibold text-brand-950">Pix</p>
        <p className="mt-1 text-sm text-brand-700">QR Code, copia e cola e confirmacao por status.</p>
      </button>

      <button
        className={cn(
          'rounded-[24px] border p-5 text-left',
          value === PAYMENT_METHODS.CREDIT_CARD
            ? 'border-brand-900 bg-brand-100'
            : 'border-brand-200 bg-white',
        )}
        type="button"
        onClick={() => onChange(PAYMENT_METHODS.CREDIT_CARD)}
      >
        <FiCreditCard className="text-xl text-brand-700" />
        <p className="mt-3 text-lg font-semibold text-brand-950">Cartao via PagBank</p>
        <p className="mt-1 text-sm text-brand-700">
          O frontend deve tokenizar os dados e enviar apenas o token para o backend.
        </p>
      </button>
    </div>
  )
}
