'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type FieldErrors, type Resolver, useForm } from 'react-hook-form'
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ErrorState } from '@/components/common/ErrorState'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'
import { ProductOptionCard } from '@/features/catalog/components/ProductOptionCard'
import { useBook } from '@/features/catalog/hooks/useBook'
import type { ProductVariant } from '@/features/catalog/types/catalog.types'
import { CheckoutSummary } from '@/features/checkout/components/CheckoutSummary'
import { CustomerFormFields } from '@/features/checkout/components/CustomerFormFields'
import { useCheckout } from '@/features/checkout/hooks/useCheckout'
import { checkoutService } from '@/features/checkout/services/checkout.service'
import type { CheckoutFormData } from '@/features/checkout/types/checkout.types'
import { createCheckoutSchema } from '@/features/checkout/validators/checkout.schema'
import { MercadoPagoCardFields } from '@/features/payment/components/MercadoPagoCardFields'
import { PaymentMethodSelector } from '@/features/payment/components/PaymentMethodSelector'
import { PixPaymentBox } from '@/features/payment/components/PixPaymentBox'
import { usePaymentStatus } from '@/features/payment/hooks/usePaymentStatus'
import { paymentService } from '@/features/payment/services/payment.service'
import { PAYMENT_METHODS, PAYMENT_STATUSES } from '@/types/enums'

function getFirstFormErrorMessage(errors: FieldErrors<CheckoutFormData>): string | null {
  const stack = Object.values(errors)

  while (stack.length > 0) {
    const current = stack.shift()

    if (!current) {
      continue
    }

    if (typeof current === 'object' && 'message' in current && typeof current.message === 'string') {
      return current.message
    }

    if (typeof current === 'object') {
      stack.push(...Object.values(current))
    }
  }

  return null
}

export function CheckoutPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMercadoPagoReady, setIsMercadoPagoReady] = useState(false)
  const {
    selectedProduct,
    setSelectedProduct,
    checkoutData,
    setCheckoutData,
    setOrder,
    order,
    setPaymentMethod,
    pixPayment,
    setPixPayment,
    setPaymentStatus,
  } = useCheckout()
  const { data: book } = useBook()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<CheckoutFormData['paymentMethod']>(
    checkoutData.paymentMethod ?? PAYMENT_METHODS.PIX,
  )

  const selectedProductRef = useRef(selectedProduct)

  selectedProductRef.current = selectedProduct

  const resolver = useCallback<Resolver<CheckoutFormData>>(
    async (values, context, options) => {
      const schema = createCheckoutSchema(
        selectedProductRef.current,
      )
      const dynamicResolver = zodResolver(schema) as Resolver<CheckoutFormData>

      return dynamicResolver(values, context, options)
    },
    [],
  )

  const {
    clearErrors,
    getValues,
    register,
    handleSubmit,
    unregister,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver,
    shouldUnregister: true,
    defaultValues: {
      customer: {
        fullName: checkoutData.customer?.fullName ?? '',
        email: checkoutData.customer?.email ?? '',
        phone: checkoutData.customer?.phone ?? '',
        cpf: checkoutData.customer?.cpf ?? '',
      },
      shippingAddress: checkoutData.shippingAddress,
      paymentMethod: checkoutData.paymentMethod ?? PAYMENT_METHODS.PIX,
      autographMessage: checkoutData.autographMessage ?? '',
      giftWrap: checkoutData.giftWrap ?? false,
      card: {
        holderName: '',
        holderCpf: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        installments: 1,
      },
    },
  })

  const paymentStatusQuery = usePaymentStatus(
    order?.paymentMethod === PAYMENT_METHODS.PIX && pixPayment ? order.id : undefined,
  )

  useEffect(() => {
    if (selectedPaymentMethod === PAYMENT_METHODS.PIX) {
      unregister('card')
      clearErrors('card')
    }
  }, [clearErrors, selectedPaymentMethod, unregister])

  useEffect(() => {
    if (!paymentStatusQuery.data) {
      return
    }

    setPaymentStatus(paymentStatusQuery.data.status)

    if (paymentStatusQuery.data.status === PAYMENT_STATUSES.PAID) {
      router.push(`${ROUTES.paymentSuccess}?orderId=${paymentStatusQuery.data.orderId}`)
    }

    if (
      paymentStatusQuery.data.status === PAYMENT_STATUSES.EXPIRED ||
      paymentStatusQuery.data.status === PAYMENT_STATUSES.FAILED ||
      paymentStatusQuery.data.status === PAYMENT_STATUSES.CANCELLED
    ) {
      router.push(`${ROUTES.paymentFailure}?orderId=${paymentStatusQuery.data.orderId}`)
    }
  }, [paymentStatusQuery.data, router, setPaymentStatus])

  const handleProductSelection = (product: ProductVariant) => {
    setSelectedProduct(product)
    setPixPayment(null)
  }

  const handlePaymentMethodChange = (method: CheckoutFormData['paymentMethod']) => {
    setSelectedPaymentMethod(method)
    setPixPayment(null)
    setValue('paymentMethod', method, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })

    if (method === PAYMENT_METHODS.PIX) {
      unregister('card')
      clearErrors('card')
    }
  }

  const showFormErrors = (formErrors: FieldErrors<CheckoutFormData>) => {
    const firstErrorMessage = getFirstFormErrorMessage(formErrors)

    toast.error(
      firstErrorMessage ??
        (selectedPaymentMethod === PAYMENT_METHODS.PIX
          ? 'Preencha os campos obrigatorios para gerar o Pix.'
          : 'Preencha os campos obrigatorios para concluir o pagamento.'),
    )
  }

  const validateCheckoutForm = async () => {
    let validatedData: CheckoutFormData | null = null

    await handleSubmit(
      async (data) => {
        validatedData = data
      },
      (formErrors) => {
        showFormErrors(formErrors)
      },
    )()

    return validatedData
  }

  const completeCheckoutOrder = async (data: CheckoutFormData) => {
    if (!selectedProduct) {
      toast.error('Escolha uma edicao antes de continuar.')
      return null
    }

    const normalizedData: CheckoutFormData = {
      ...data,
      paymentMethod: selectedPaymentMethod,
    }

    setCheckoutData(normalizedData)
    setPaymentMethod(selectedPaymentMethod)

    const createdOrder = await checkoutService.createOrder(normalizedData, selectedProduct)
    setOrder(createdOrder)
    setPaymentStatus(createdOrder.paymentStatus)

    return createdOrder
  }

  const handlePixSubmit = async () => {
    const data = await validateCheckoutForm()

    if (!data) {
      return
    }

    try {
      setIsSubmitting(true)
      const createdOrder = await completeCheckoutOrder(data)

      if (!createdOrder) {
        return
      }

      const pix = await paymentService.createPixPayment(createdOrder.id)
      setPixPayment(pix)
      setPaymentStatus(pix.status)
      toast.success('Pix gerado com sucesso.')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Nao foi possivel concluir o checkout.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMercadoPagoValidation = async () => {
    if (selectedPaymentMethod !== PAYMENT_METHODS.CREDIT_CARD) {
      return false
    }

    const data = await validateCheckoutForm()

    if (!data) {
      return false
    }

    return true
  }

  const handleMercadoPagoSubmit = async ({
    token,
    paymentMethodId,
    issuerId,
    installments,
  }: {
    token: string
    paymentMethodId: string
    issuerId?: string
    installments: number
  }) => {
    if (selectedPaymentMethod !== PAYMENT_METHODS.CREDIT_CARD) {
      return
    }

    const data = getValues()

    try {
      setIsSubmitting(true)
      const createdOrder = await completeCheckoutOrder(data)

      if (!createdOrder) {
        return
      }

      const cardPayment = await paymentService.payWithCard({
        orderId: createdOrder.id,
        token,
        paymentMethodId,
        issuerId,
        installments,
      })

      setPaymentStatus(cardPayment.status)

      if (
        cardPayment.status === PAYMENT_STATUSES.FAILED ||
        cardPayment.status === PAYMENT_STATUSES.CANCELLED ||
        cardPayment.status === PAYMENT_STATUSES.EXPIRED
      ) {
        router.push(`${ROUTES.paymentFailure}?orderId=${createdOrder.id}`)
        return
      }

      router.push(
        `${ROUTES.paymentSuccess}?orderId=${createdOrder.id}&status=${cardPayment.status}`,
      )
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Nao foi possivel concluir o pagamento com cartao.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Seo
        title="Checkout | A Ninfa de Prata"
        description="Finalize a compra do livro com Pix ou cartao via Mercado Pago."
      />

      <section className="space-y-8">
        <div className="dark-surface-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0">
            <div className="absolute left-10 top-0 h-36 w-36 rounded-full bg-mystic-700/25 blur-[90px]" />
            <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-nymph-500/14 blur-[100px]" />
          </div>

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-nymph-300/75">
                Checkout oficial
              </p>
              <h1 className="mt-3 text-4xl text-white sm:text-5xl">
                {selectedProduct
                  ? 'Seu exemplar esta quase com voce'
                  : 'Escolha a edicao ideal para continuar'}
              </h1>
              <p className="mt-4 max-w-xl text-base text-white/66 sm:text-lg">
                Finalize a compra de {book?.title ?? 'A Ninfa de Prata'} com a mesma atmosfera da jornada: fundo noturno, brilhos suaves e um fluxo simples ate o pagamento.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-white/70">
              {selectedProduct ? (
                <>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2">
                    <FiCheckCircle className="text-nymph-300" />
                    {selectedProduct.name}
                  </span>
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-white/75 hover:border-white/20 hover:bg-white/[0.06]"
                    type="button"
                    onClick={() => {
                      setSelectedProduct(null)
                      setPixPayment(null)
                    }}
                  >
                    <FiArrowLeft />
                    Trocar edicao
                  </button>
                </>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2">
                  <FiCheckCircle className="text-silver-300" />
                  Escolha um item para liberar o formulario
                </span>
              )}
            </div>
          </div>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {!selectedProduct ? (
              <div className="space-y-6">
                <ErrorState
                  title="Escolha uma edicao para continuar"
                  description="O checkout foi preparado para item unico por pedido. Selecione o formato do livro e seguimos."
                  theme="dark"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  {book?.variants.map((product) => (
                    <ProductOptionCard
                      key={product.id}
                      product={product}
                      onSelect={handleProductSelection}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <form
                id="checkout-form"
                className="space-y-6"
              >
                <input type="hidden" {...register('paymentMethod')} />

                <div className="dark-surface-card p-6 sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-300/75">
                    Pagamento
                  </p>
                  <h2 className="mt-2 text-4xl text-white">Finalize sua compra</h2>
                  <p className="mt-3 text-white/65">
                    A UI coleta os dados da pessoa compradora, mas a logica sensivel de pagamento deve permanecer no backend.
                  </p>
                </div>

                <div className="dark-surface-card p-6 sm:p-8">
                  <CustomerFormFields
                    errors={errors}
                    register={register}
                    setValue={setValue}
                    showAutographField={selectedProduct.autographAvailable}
                    showShippingAddress={selectedProduct.shippingRequired}
                  />
                </div>

                <div className="dark-surface-card p-6 sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-mystic-400/75">
                    Confirmacao
                  </p>
                  <h2 className="mt-2 text-2xl text-white">Metodo de pagamento</h2>
                  <div className="mt-4">
                    <PaymentMethodSelector
                      value={selectedPaymentMethod}
                      onChange={handlePaymentMethodChange}
                    />
                  </div>

                  {selectedPaymentMethod === PAYMENT_METHODS.CREDIT_CARD ? (
                    <MercadoPagoCardFields
                      amount={selectedProduct.price}
                      disabled={isSubmitting}
                      onReadyStateChange={setIsMercadoPagoReady}
                      onSubmit={handleMercadoPagoSubmit}
                      onValidateBeforeSubmit={handleMercadoPagoValidation}
                    />
                  ) : null}

                  <Button
                    className="mt-6 rounded-xl cursor-pointer bg-linear-to-r from-silver-300 to-silver-200 px-8 py-4 font-bold text-forest-900 shadow-[0_0_20px_rgba(237,177,255,0.18)] hover:brightness-105"
                    disabled={
                      isSubmitting ||
                      (selectedPaymentMethod === PAYMENT_METHODS.CREDIT_CARD && !isMercadoPagoReady)
                    }
                    fullWidth
                    onClick={
                      selectedPaymentMethod === PAYMENT_METHODS.PIX
                        ? () => {
                            void handlePixSubmit()
                          }
                        : undefined
                    }
                    type={selectedPaymentMethod === PAYMENT_METHODS.PIX ? 'button' : 'submit'}
                    variant="ghost"
                  >
                    {isSubmitting
                      ? 'Processando...'
                      : selectedPaymentMethod === PAYMENT_METHODS.PIX
                        ? 'Gerar Pix'
                        : isMercadoPagoReady
                          ? 'Pagar com cartao'
                          : 'Preparando formulario...'}
                  </Button>
                </div>

                {pixPayment ? (
                  <PixPaymentBox
                    currentStatus={paymentStatusQuery.data?.status}
                    pixPayment={pixPayment}
                  />
                ) : null}
              </form>
            )}
          </div>

          {selectedProduct ? <CheckoutSummary product={selectedProduct} /> : null}
        </section>
      </section>
    </>
  )
}
