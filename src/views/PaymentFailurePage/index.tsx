import Link from 'next/link'
import { FiAlertCircle } from 'react-icons/fi'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

interface PaymentFailurePageProps {
  orderId?: string
}

export function PaymentFailurePage({ orderId }: PaymentFailurePageProps) {

  return (
    <>
      <Seo title="Falha no pagamento" description="Nao foi possivel concluir o pagamento." />
      <section className="mx-auto max-w-3xl surface-card p-8 text-center sm:p-12">
        <FiAlertCircle className="mx-auto text-6xl text-amber-500" />
        <h1 className="mt-6 text-5xl">Pagamento nao confirmado</h1>
        <p className="mt-4 text-brand-700">
          O pedido {orderId ? <strong>{orderId}</strong> : ''} nao foi finalizado. O fluxo ja esta preparado para tratar expiracao do Pix, recusas e tentativas de novo pagamento.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={ROUTES.checkout}>
            <Button>Tentar novamente</Button>
          </Link>
          <Link href={ROUTES.home}>
            <Button variant="secondary">Voltar para a home</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
