import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Resolver, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
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
import { PaymentMethodSelector } from '@/features/payment/components/PaymentMethodSelector'
import { PixPaymentBox } from '@/features/payment/components/PixPaymentBox'
import { usePaymentStatus } from '@/features/payment/hooks/usePaymentStatus'
import { paymentService } from '@/features/payment/services/payment.service'
import { PAYMENT_METHODS, PAYMENT_STATUSES } from '@/types/enums'

export function CheckoutPage() {
  const navigate = useNavigate()
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

  const schema = useMemo(() => createCheckoutSchema(selectedProduct), [selectedProduct])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema) as Resolver<CheckoutFormData>,
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

  const paymentMethod = watch('paymentMethod')
  const paymentStatusQuery = usePaymentStatus(
    order?.paymentMethod === PAYMENT_METHODS.PIX ? order.id : undefined,
  )

  useEffect(() => {
    if (!paymentStatusQuery.data) {
      return
    }

    setPaymentStatus(paymentStatusQuery.data.status)

    if (paymentStatusQuery.data.status === PAYMENT_STATUSES.PAID) {
      navigate(`${ROUTES.paymentSuccess}?orderId=${paymentStatusQuery.data.orderId}`)
    }

    if (
      paymentStatusQuery.data.status === PAYMENT_STATUSES.EXPIRED ||
      paymentStatusQuery.data.status === PAYMENT_STATUSES.FAILED ||
      paymentStatusQuery.data.status === PAYMENT_STATUSES.CANCELLED
    ) {
      navigate(`${ROUTES.paymentFailure}?orderId=${paymentStatusQuery.data.orderId}`)
    }
  }, [navigate, paymentStatusQuery.data, setPaymentStatus])

  const handleProductSelection = (product: ProductVariant) => {
    setSelectedProduct(product)
    setPixPayment(null)
  }

  const onSubmit = async (data: CheckoutFormData) => {
    if (!selectedProduct) {
      toast.error('Escolha uma edicao antes de continuar.')
      return
    }

    try {
      setIsSubmitting(true)
      setCheckoutData(data)
      setPaymentMethod(data.paymentMethod)

      const createdOrder = await checkoutService.createOrder(data, selectedProduct)
      setOrder(createdOrder)
      setPaymentStatus(createdOrder.paymentStatus)

      if (data.paymentMethod === PAYMENT_METHODS.PIX) {
        const pix = await paymentService.createPixPayment(createdOrder.id)
        setPixPayment(pix)
        setPaymentStatus(pix.status)
        toast.success('Pix gerado com sucesso.')
        return
      }

      const cardResponse = await paymentService.payWithCard({
        orderId: createdOrder.id,
        cardToken: `demo-${data.card?.cardNumber?.slice(-4) ?? '1111'}`,
        installments: data.card?.installments ?? 1,
        holderName: data.card?.holderName ?? '',
        holderCpf: data.card?.holderCpf ?? '',
      })

      setPaymentStatus(cardResponse.status)

      if (cardResponse.status === PAYMENT_STATUSES.PAID) {
        navigate(`${ROUTES.paymentSuccess}?orderId=${createdOrder.id}`)
        return
      }

      navigate(`${ROUTES.paymentFailure}?orderId=${createdOrder.id}`)
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

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {!selectedProduct ? (
            <div className="space-y-6">
              <ErrorState
                title="Escolha uma edicao para continuar"
                description="O checkout foi preparado para item unico por pedido. Selecione o formato do livro e seguimos."
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
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="surface-card p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-500">
                  Pagamento
                </p>
                <h1 className="mt-2 text-4xl">Finalize sua compra</h1>
                <p className="mt-3 text-brand-700">
                  A UI coleta os dados da pessoa compradora, mas a logica sensivel de pagamento deve permanecer no backend.
                </p>
              </div>

              <div className="surface-card p-6 sm:p-8">
                <CustomerFormFields
                  errors={errors}
                  register={register}
                  setValue={setValue}
                  showAutographField={selectedProduct.autographAvailable}
                  showShippingAddress={selectedProduct.shippingRequired}
                />
              </div>

              <div className="surface-card p-6 sm:p-8">
                <h2 className="text-2xl">Metodo de pagamento</h2>
                <div className="mt-4">
                  <PaymentMethodSelector
                    value={paymentMethod}
                    onChange={(method) => setValue('paymentMethod', method)}
                  />
                </div>

                {paymentMethod === PAYMENT_METHODS.CREDIT_CARD ? (
                  <CreditCardFields
                    errors={errors}
                    register={register}
                    setValue={setValue}
                  />
                ) : null}

                <Button className="mt-6" disabled={isSubmitting} fullWidth type="submit">
                  {isSubmitting
                    ? 'Processando...'
                    : paymentMethod === PAYMENT_METHODS.PIX
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
    </>
  )
}
