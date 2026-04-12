import { LegalLayout } from '@/layouts/LegalLayout'

export default function LegalRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <LegalLayout>{children}</LegalLayout>
}
