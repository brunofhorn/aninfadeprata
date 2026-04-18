'use client'

import { useEffect, useRef, useState } from 'react'
import { FiCreditCard, FiLoader, FiShield } from 'react-icons/fi'
import { cn } from '@/utils/cn'
import {
  loadMercadoPagoSdk,
  type MercadoPagoCardFormController,
  type MercadoPagoCardFormData,
} from '@/features/payment/utils/mercado-pago'

interface MercadoPagoCardSubmitPayload {
  token: string
  paymentMethodId: string
  issuerId?: string
  installments: number
}

interface MercadoPagoCardFieldsProps {
  amount: number
  disabled?: boolean
  onValidateBeforeSubmit: () => Promise<boolean>
  onSubmit: (payload: MercadoPagoCardSubmitPayload) => Promise<void>
  onReadyStateChange?: (isReady: boolean) => void
}

function SelectField({
  id,
  label,
}: {
  id: string
  label: string
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-white/78" htmlFor={id}>
      <span>{label}</span>
      <select
        id={id}
        className="h-12 rounded-2xl border border-white/10 bg-forest-950/70 px-4 text-sm text-white focus-visible:ring-nymph-400/60 focus-visible:ring-offset-forest-950"
        defaultValue=""
      >
        <option value="" disabled>
          Carregando...
        </option>
      </select>
    </label>
  )
}

function SecureField({
  id,
  label,
}: {
  id: string
  label: string
}) {
  return (
    <div className="flex flex-col gap-2 text-sm font-medium text-white/78">
      <span>{label}</span>
      <div
        id={id}
        className="flex h-12 items-center rounded-2xl border border-white/10 bg-forest-950/70 px-4 text-sm text-white"
      />
    </div>
  )
}

export function MercadoPagoCardFields({
  amount,
  disabled = false,
  onValidateBeforeSubmit,
  onSubmit,
  onReadyStateChange,
}: MercadoPagoCardFieldsProps) {
  const publicKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY?.trim()
  const missingPublicKey = !publicKey
  const cardFormRef = useRef<MercadoPagoCardFormController | null>(null)
  const submitHandlerRef = useRef(onSubmit)
  const validateBeforeSubmitRef = useRef(onValidateBeforeSubmit)
  const [sdkError, setSdkError] = useState<string | null>(null)
  const [isSdkBusy, setIsSdkBusy] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    submitHandlerRef.current = onSubmit
    validateBeforeSubmitRef.current = onValidateBeforeSubmit
  }, [onSubmit, onValidateBeforeSubmit])

  useEffect(() => {
    onReadyStateChange?.(isReady)
  }, [isReady, onReadyStateChange])

  useEffect(() => {
    let mounted = true

    if (missingPublicKey) {
      return
    }

    const resolvedPublicKey = publicKey

    async function initializeCardForm() {
      try {
        setSdkError(null)
        setIsReady(false)

        const MercadoPago = await loadMercadoPagoSdk()

        if (!mounted) {
          return
        }

        const mp = new MercadoPago(resolvedPublicKey, {
          locale: 'pt-BR',
        })

        cardFormRef.current?.unmount?.()
        cardFormRef.current?.destroy?.()

        const controller = mp.cardForm({
          amount: amount.toFixed(2),
          iframe: true,
          form: {
            id: 'checkout-form',
            cardholderName: {
              id: 'fullName',
              placeholder: 'Nome completo',
            },
            cardholderEmail: {
              id: 'email',
              placeholder: 'voce@email.com',
            },
            cardNumber: {
              id: 'mp-card-number',
              placeholder: 'Numero do cartao',
            },
            expirationDate: {
              id: 'mp-expiration-date',
              placeholder: 'MM/AA',
            },
            securityCode: {
              id: 'mp-security-code',
              placeholder: 'CVV',
            },
            installments: {
              id: 'mp-installments',
              placeholder: 'Parcelas',
            },
            identificationType: {
              id: 'mp-identification-type',
              placeholder: 'Tipo de documento',
            },
            identificationNumber: {
              id: 'cpf',
              placeholder: '000.000.000-00',
            },
            issuer: {
              id: 'mp-issuer',
              placeholder: 'Banco emissor',
            },
          },
          callbacks: {
            onFormMounted: (error: unknown) => {
              if (!mounted) {
                return
              }

              if (error instanceof Error) {
                setSdkError(error.message)
                setIsReady(false)
                return
              }

              if (error) {
                setSdkError('Nao foi possivel inicializar o formulario do Mercado Pago.')
                setIsReady(false)
                return
              }

              setIsReady(true)
            },
            onFetching: () => {
              if (mounted) {
                setIsSdkBusy(true)
              }

              return () => {
                if (mounted) {
                  setIsSdkBusy(false)
                }
              }
            },
            onSubmit: async (event: Event) => {
              event.preventDefault()

              const isValid = await validateBeforeSubmitRef.current()

              if (!isValid) {
                return
              }

              const formData = controller.getCardFormData() as MercadoPagoCardFormData

              if (!formData.token || !formData.paymentMethodId || !formData.installments) {
                throw new Error('Preencha os dados do cartao para continuar.')
              }

              await submitHandlerRef.current({
                token: formData.token,
                paymentMethodId: formData.paymentMethodId,
                issuerId: formData.issuerId || undefined,
                installments: Number(formData.installments),
              })
            },
          },
        })

        cardFormRef.current = controller
      } catch (error) {
        if (!mounted) {
          return
        }

        setSdkError(
          error instanceof Error
            ? error.message
            : 'Nao foi possivel carregar o formulario seguro do Mercado Pago.',
        )
        setIsReady(false)
      }
    }

    void initializeCardForm()

    return () => {
      mounted = false
      setIsReady(false)
      cardFormRef.current?.unmount?.()
      cardFormRef.current?.destroy?.()
      cardFormRef.current = null
    }
  }, [amount, missingPublicKey, publicKey])

  const feedbackMessage = missingPublicKey
    ? 'NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY nao foi configurada.'
    : sdkError

  return (
    <section className="mt-6 space-y-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-5 sm:p-6">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-silver-300/75">
          Cartao
        </p>
        <h3 className="text-2xl text-white">Pagamento transparente</h3>
        <p className="text-sm text-white/60">
          Numero, validade e CVV sao capturados em campos seguros do Mercado Pago sem sair desta pagina.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SecureField id="mp-card-number" label="Numero do cartao" />
        <SecureField id="mp-expiration-date" label="Validade" />
        <SecureField id="mp-security-code" label="Codigo de seguranca" />
        <SelectField id="mp-issuer" label="Banco emissor" />
        <SelectField id="mp-installments" label="Parcelas" />
        <SelectField id="mp-identification-type" label="Tipo de documento" />
      </div>

      <div
        className={cn(
          'flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm',
          feedbackMessage
            ? 'border-red-400/40 bg-red-500/10 text-red-200'
            : 'border-white/8 bg-white/[0.02] text-white/60',
        )}
      >
        {feedbackMessage ? <FiCreditCard className="mt-0.5 shrink-0" /> : <FiShield className="mt-0.5 shrink-0" />}
        <div className="space-y-1">
          {feedbackMessage ? (
            <p>{feedbackMessage}</p>
          ) : (
            <>
              <p>Os dados PCI ficam dentro de iframes do Mercado Pago.</p>
              <p className="flex items-center gap-2 text-white/45">
                {isSdkBusy ? <FiLoader className="animate-spin" /> : null}
                {isReady ? 'Formulario pronto para uso.' : 'Preparando campos seguros...'}
              </p>
            </>
          )}
        </div>
      </div>

      <input disabled={disabled} readOnly type="hidden" value={amount.toFixed(2)} />
    </section>
  )
}
