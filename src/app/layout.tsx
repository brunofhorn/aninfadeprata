import type { Metadata } from 'next'
import { AppProviders } from '@/app/providers/AppProviders'
import './styles/globals.css'

export const metadata: Metadata = {
  title: 'A Ninfa de Prata',
  description: 'Landing page comercial com checkout funcional para venda do livro.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
