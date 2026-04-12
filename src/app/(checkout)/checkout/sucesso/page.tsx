import type { Metadata } from 'next'
import { PaymentSuccessPage } from '@/views/PaymentSuccessPage'

export const metadata: Metadata = {
  title: 'Pagamento aprovado',
  description: 'Pedido concluido com sucesso.',
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const params = await searchParams
  return <PaymentSuccessPage orderId={params.orderId} />
}
