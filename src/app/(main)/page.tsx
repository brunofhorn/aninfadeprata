import type { Metadata } from 'next'
import { HomePage } from '@/views/HomePage'

export const metadata: Metadata = {
  title: 'A Ninfa de Prata | Landing page oficial',
  description: 'Landing page oficial do livro A Ninfa de Prata.',
}

export default function Page() {
  return <HomePage />
}
