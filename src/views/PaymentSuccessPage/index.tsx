import Link from 'next/link'
import { FiCheckCircle } from 'react-icons/fi'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'
import { PAYMENT_STATUSES } from '@/types/enums'

interface PaymentSuccessPageProps {
  orderId?: string
  status?: string
}

export function PaymentSuccessPage({ orderId, status }: PaymentSuccessPageProps) {
  const isApproved =
    !status ||
    status === PAYMENT_STATUSES.PAID ||
    status === PAYMENT_STATUSES.AUTHORIZED
  const title = isApproved ? 'Pagamento confirmado' : 'Pagamento recebido'
  const description = isApproved
    ? 'O pagamento foi aprovado e o pedido ja pode seguir para entrega ou liberacao digital.'
    : 'O pagamento foi enviado ao Mercado Pago e agora aguarda confirmacao final ou analise antifraude.'

  return (
    <>
      <Seo title={title} description={description} />
      <section className="mx-auto max-w-3xl surface-card p-8 text-center sm:p-12">
        <FiCheckCircle className="mx-auto text-6xl text-accent-600" />
        <h1 className="mt-6 text-5xl">{title}</h1>
        <p className="mt-4 text-brand-700">
          Pedido {orderId ? <strong>{orderId}</strong> : 'gerado'}. {description}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={ROUTES.home}>
            <Button>Voltar para a home</Button>
          </Link>
          <Link href={ROUTES.bookDetails}>
            <Button variant="secondary">Ver detalhes do livro</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
