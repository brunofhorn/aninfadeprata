import type { Metadata } from 'next'
import { PrivacyPolicyPage } from '@/views/PrivacyPolicyPage'

export const metadata: Metadata = {
  title: 'Politica de privacidade',
  description: 'Politica de privacidade do projeto.',
}

export default function Page() {
  return <PrivacyPolicyPage />
}
