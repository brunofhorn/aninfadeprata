import type { Metadata } from 'next'
import { CheckoutPage } from '@/views/CheckoutPage'

export const metadata: Metadata = {
  title: 'Checkout | A Ninfa de Prata',
  description: 'Finalize a compra do livro com Pix ou cartao.',
}

export default function Page() {
  return <CheckoutPage />
}
