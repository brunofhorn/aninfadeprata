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
import { CreditCardFields } from '@/features/payment/components/CreditCardFields'
import { usePagBankSdk } from '@/features/payment/hooks/usePagBankSdk'
import { PaymentMethodSelector } from '@/features/payment/components/PaymentMethodSelector'
import { PixPaymentBox } from '@/features/payment/components/PixPaymentBox'
import { usePaymentStatus } from '@/features/payment/hooks/usePaymentStatus'
import { paymentService } from '@/features/payment/services/payment.service'
import { encryptCardWithPagBank } from '@/features/payment/utils/pagbank'
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
  const selectedPaymentMethodRef = useRef(selectedPaymentMethod)

  selectedProductRef.current = selectedProduct
  selectedPaymentMethodRef.current = selectedPaymentMethod

  const resolver = useCallback<Resolver<CheckoutFormData>>(
    async (values, context, options) => {
      const schema = createCheckoutSchema(
        selectedProductRef.current,
        selectedPaymentMethodRef.current,
      )
      const dynamicResolver = zodResolver(schema) as Resolver<CheckoutFormData>

      return dynamicResolver(values, context, options)
    },
    [],
  )

  const {
    clearErrors,
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
  usePagBankSdk(selectedPaymentMethod)

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

  const onSubmit = async (data: CheckoutFormData) => {
    if (!selectedProduct) {
      toast.error('Escolha uma edicao antes de continuar.')
      return
    }

    try {
      setIsSubmitting(true)
      const normalizedData: CheckoutFormData = {
        ...data,
        paymentMethod: selectedPaymentMethod,
      }

      setCheckoutData(normalizedData)
      setPaymentMethod(selectedPaymentMethod)

      const createdOrder = await checkoutService.createOrder(normalizedData, selectedProduct)
      setOrder(createdOrder)
      setPaymentStatus(createdOrder.paymentStatus)

      if (selectedPaymentMethod === PAYMENT_METHODS.PIX) {
        const pix = await paymentService.createPixPayment(createdOrder.id)
        setPixPayment(pix)
        setPaymentStatus(pix.status)
        toast.success('Pix gerado com sucesso.')
        return
      }

      const holderName = data.card?.holderName ?? ''
      const holderCpf = data.card?.holderCpf ?? ''
      const installments = data.card?.installments ?? 1
      const pagBankPublicKey = process.env.NEXT_PUBLIC_PAGBANK_PUBLIC_KEY?.trim()

      if (!pagBankPublicKey) {
        throw new Error('NEXT_PUBLIC_PAGBANK_PUBLIC_KEY nao foi configurada para o checkout transparente.')
      }

      const encryptedCard = await encryptCardWithPagBank({
        publicKey: pagBankPublicKey,
        holderName,
        cardNumber: data.card?.cardNumber ?? '',
        expiry: data.card?.expiry ?? '',
        securityCode: data.card?.cvv ?? '',
      })

      const cardResponse = await paymentService.payWithCard({
        orderId: createdOrder.id,
        encryptedCard,
        installments,
        holderName,
        holderCpf,
      })

      setPaymentStatus(cardResponse.status)

      if (cardResponse.status === PAYMENT_STATUSES.PAID) {
        router.push(`${ROUTES.paymentSuccess}?orderId=${createdOrder.id}`)
        return
      }

      router.push(`${ROUTES.paymentFailure}?orderId=${createdOrder.id}`)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Nao foi possivel concluir o checkout.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Seo
        title="Checkout | A Ninfa de Prata"
        description="Finalize a compra do livro com Pix ou cartao via backend seguro."
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
                className="space-y-6"
                onSubmit={handleSubmit(onSubmit, (formErrors) => {
                  const firstErrorMessage = getFirstFormErrorMessage(formErrors)

                  toast.error(
                      firstErrorMessage ??
                      (selectedPaymentMethod === PAYMENT_METHODS.PIX
                        ? 'Preencha os campos obrigatorios para gerar o Pix.'
                        : 'Preencha os campos obrigatorios para concluir o pagamento.'),
                  )
                })}
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
                    <CreditCardFields
                      errors={errors}
                      register={register}
                      setValue={setValue}
                    />
                  ) : null}

                  <Button
                    className="mt-6 rounded-xl cursor-pointer bg-linear-to-r from-silver-300 to-silver-200 px-8 py-4 font-bold text-forest-900 shadow-[0_0_20px_rgba(237,177,255,0.18)] hover:brightness-105"
                    disabled={isSubmitting}
                    fullWidth
                    type="submit"
                    variant="ghost"
                  >
                    {isSubmitting
                      ? 'Processando...'
                      : selectedPaymentMethod === PAYMENT_METHODS.PIX
                        ? 'Gerar Pix'
                        : 'Pagar com cartao'}
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
