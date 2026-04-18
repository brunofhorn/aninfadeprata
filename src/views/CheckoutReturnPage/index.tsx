'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiLoader } from 'react-icons/fi'
import { Seo } from '@/components/common/Seo'
import { ROUTES } from '@/constants/routes'
import { usePaymentStatus } from '@/features/payment/hooks/usePaymentStatus'
import { PAYMENT_STATUSES } from '@/types/enums'

interface CheckoutReturnPageProps {
  orderId?: string
}

export function CheckoutReturnPage({ orderId }: CheckoutReturnPageProps) {
  const router = useRouter()
  const paymentStatusQuery = usePaymentStatus(orderId, {
    enabled: Boolean(orderId),
    refetchInterval: (query) => {
      const status = query.state.data?.status

      if (
        status === PAYMENT_STATUSES.PAID ||
        status === PAYMENT_STATUSES.FAILED ||
        status === PAYMENT_STATUSES.CANCELLED ||
        status === PAYMENT_STATUSES.EXPIRED
      ) {
        return false
      }

      return 2500
    },
  })

  useEffect(() => {
    if (!orderId) {
      router.replace(ROUTES.checkout)
      return
    }

    const status = paymentStatusQuery.data?.status

    if (!status) {
      return
    }

    if (status === PAYMENT_STATUSES.PAID) {
      router.replace(`${ROUTES.paymentSuccess}?orderId=${orderId}`)
      return
    }

    if (
      status === PAYMENT_STATUSES.FAILED ||
      status === PAYMENT_STATUSES.CANCELLED ||
      status === PAYMENT_STATUSES.EXPIRED
    ) {
      router.replace(`${ROUTES.paymentFailure}?orderId=${orderId}`)
    }
  }, [orderId, paymentStatusQuery.data?.status, router])

  return (
    <>
      <Seo title="Verificando pagamento" description="Aguardando retorno do Mercado Pago." />
      <section className="mx-auto max-w-3xl dark-surface-card p-8 text-center sm:p-12">
        <FiLoader className="mx-auto animate-spin text-5xl text-silver-300" />
        <h1 className="mt-6 text-4xl text-white">Verificando o retorno do Mercado Pago</h1>
        <p className="mt-4 text-white/65">
          Estamos consultando o status do pagamento do seu pedido para te enviar para a tela correta.
        </p>
      </section>
    </>
  )
}
