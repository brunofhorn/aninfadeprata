import { FiClock, FiCopy } from 'react-icons/fi'
import { toast } from 'sonner'
import { PAYMENT_STATUS_LABELS } from '@/constants/payment'
import { Button } from '@/components/ui/Button'
import type { PixPaymentResponse } from '@/features/payment/types/payment.types'

interface PixPaymentBoxProps {
  pixPayment: PixPaymentResponse
  currentStatus?: string
}

export function PixPaymentBox({
  pixPayment,
  currentStatus,
}: PixPaymentBoxProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(pixPayment.qrCodeText)
    toast.success('Codigo Pix copiado.')
  }

  return (
    <div className="dark-surface-card p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <img
          alt="QR Code Pix"
          className="size-52 rounded-[24px] border border-white/10 bg-white p-4"
          src={pixPayment.qrCodeImageUrl}
        />

        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-nymph-300/75">
            Pagamento via Pix
          </p>
          <h2 className="mt-2 text-3xl text-white">Finalize a compra no seu banco</h2>
          <p className="mt-3 text-white/65">
            O checkout acompanha o status automaticamente e redireciona quando o backend confirmar o pagamento.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/75">
            <p className="font-semibold text-white">Status atual</p>
            <p className="mt-1">
              {PAYMENT_STATUS_LABELS[
                (currentStatus ?? pixPayment.status) as keyof typeof PAYMENT_STATUS_LABELS
              ] ?? currentStatus}
            </p>
            <p className="mt-3 flex items-center gap-2 text-nymph-300/80">
              <FiClock />
              Expira em {new Date(pixPayment.expiresAt).toLocaleTimeString('pt-BR')}
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-forest-950/65 p-4 text-sm text-white/70">
            <p className="mb-2 font-semibold text-white">Copia e cola</p>
            <p className="break-all">{pixPayment.qrCodeText}</p>
          </div>

          <Button
            className="mt-5 border border-nymph-400/30 bg-white/6 text-nymph-300 hover:bg-nymph-400/12"
            type="button"
            variant="ghost"
            onClick={handleCopy}
          >
            <FiCopy />
            Copiar codigo Pix
          </Button>
        </div>
      </div>
    </div>
  )
}
