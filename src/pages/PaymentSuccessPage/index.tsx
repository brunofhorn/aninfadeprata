import { Link, useSearchParams } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

export function PaymentSuccessPage() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')

  return (
    <>
      <Seo title="Pagamento aprovado" description="Pedido concluido com sucesso." />
      <section className="mx-auto max-w-3xl surface-card p-8 text-center sm:p-12">
        <FiCheckCircle className="mx-auto text-6xl text-accent-600" />
        <h1 className="mt-6 text-5xl">Pagamento confirmado</h1>
        <p className="mt-4 text-brand-700">
          Pedido {orderId ? <strong>{orderId}</strong> : 'gerado'} aprovado. Para itens digitais, o proximo passo e liberar acesso por email. Para itens fisicos, o backend pode seguir com separacao e rastreio.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to={ROUTES.home}>
            <Button>Voltar para a home</Button>
          </Link>
          <Link to={ROUTES.bookDetails}>
            <Button variant="secondary">Ver detalhes do livro</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
