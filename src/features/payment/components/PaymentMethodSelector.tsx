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
          'rounded-[24px] border bg-white/[0.03] p-5 text-left',
          value === PAYMENT_METHODS.PIX
            ? 'border-nymph-400/50 shadow-[0_0_0_1px_rgba(157,232,191,0.18)]'
            : 'border-white/10 hover:border-white/20',
        )}
        type="button"
        onClick={() => onChange(PAYMENT_METHODS.PIX)}
      >
        <FiSmartphone className="text-xl text-nymph-300" />
        <p className="mt-3 text-lg font-semibold text-white">Pix</p>
        <p className="mt-1 text-sm text-white/60">
          QR Code, copia e cola e confirmacao por status.
        </p>
      </button>

      <button
        className={cn(
          'rounded-[24px] border bg-white/[0.03] p-5 text-left',
          value === PAYMENT_METHODS.CREDIT_CARD
            ? 'border-silver-300/40 shadow-[0_0_0_1px_rgba(235,230,239,0.14)]'
            : 'border-white/10 hover:border-white/20',
        )}
        type="button"
        onClick={() => onChange(PAYMENT_METHODS.CREDIT_CARD)}
      >
        <FiCreditCard className="text-xl text-silver-300" />
        <p className="mt-3 text-lg font-semibold text-white">Cartao via PagBank</p>
        <p className="mt-1 text-sm text-white/60">
          O frontend deve tokenizar os dados e enviar apenas o token para o backend.
        </p>
      </button>
    </div>
  )
}
