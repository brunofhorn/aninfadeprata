import type { Metadata } from 'next'
import { CheckoutReturnPage } from '@/views/CheckoutReturnPage'

export const metadata: Metadata = {
  title: 'Verificando pagamento',
  description: 'Aguardando retorno do Mercado Pago.',
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const params = await searchParams
  return <CheckoutReturnPage orderId={params.orderId} />
}
