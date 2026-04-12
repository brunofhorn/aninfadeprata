import type { Metadata } from 'next'
import { PaymentFailurePage } from '@/views/PaymentFailurePage'

export const metadata: Metadata = {
  title: 'Falha no pagamento',
  description: 'Nao foi possivel concluir o pagamento.',
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const params = await searchParams
  return <PaymentFailurePage orderId={params.orderId} />
}
