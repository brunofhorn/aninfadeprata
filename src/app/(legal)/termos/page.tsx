import type { Metadata } from 'next'
import { TermsPage } from '@/views/TermsPage'

export const metadata: Metadata = {
  title: 'Termos de uso',
  description: 'Termos de uso e compra do projeto.',
}

export default function Page() {
  return <TermsPage />
}
