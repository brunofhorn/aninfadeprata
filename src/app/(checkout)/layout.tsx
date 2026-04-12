import { CheckoutLayout } from '@/layouts/CheckoutLayout'

export default function PaymentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <CheckoutLayout>{children}</CheckoutLayout>
}
