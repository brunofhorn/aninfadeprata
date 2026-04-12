import type { Metadata } from 'next'
import { BookDetailsPage } from '@/views/BookDetailsPage'

export const metadata: Metadata = {
  title: 'A Ninfa de Prata | Detalhes',
  description: 'Detalhes, sinopse e opcoes de compra do livro.',
}

export default function Page() {
  return <BookDetailsPage />
}
