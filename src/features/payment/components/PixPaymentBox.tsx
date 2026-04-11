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
    <div className="surface-card p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <img
          alt="QR Code Pix"
          className="size-52 rounded-[24px] border border-brand-200 bg-white p-4"
          src={pixPayment.qrCodeImageUrl}
        />

        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-500">
            Pagamento via Pix
          </p>
          <h2 className="mt-2 text-3xl">Finalize a compra no seu banco</h2>
          <p className="mt-3 text-brand-700">
            O checkout acompanha o status automaticamente e redireciona quando o backend confirmar o pagamento.
          </p>

          <div className="mt-5 rounded-2xl bg-brand-100 p-4 text-sm text-brand-800">
            <p className="font-semibold">Status atual</p>
            <p className="mt-1">
              {PAYMENT_STATUS_LABELS[
                (currentStatus ?? pixPayment.status) as keyof typeof PAYMENT_STATUS_LABELS
              ] ?? currentStatus}
            </p>
            <p className="mt-3 flex items-center gap-2 text-brand-600">
              <FiClock />
              Expira em {new Date(pixPayment.expiresAt).toLocaleTimeString('pt-BR')}
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-brand-200 bg-white p-4 text-sm text-brand-700">
            <p className="mb-2 font-semibold text-brand-950">Copia e cola</p>
            <p className="break-all">{pixPayment.qrCodeText}</p>
          </div>

          <Button className="mt-5" type="button" variant="secondary" onClick={handleCopy}>
            <FiCopy />
            Copiar codigo Pix
          </Button>
        </div>
      </div>
    </div>
  )
}
