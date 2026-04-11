import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ROUTES } from '@/constants/routes'
import { CheckoutLayout } from '@/layouts/CheckoutLayout'
import { LegalLayout } from '@/layouts/LegalLayout'
import { MainLayout } from '@/layouts/MainLayout'

const HomePage = lazy(() =>
  import('@/pages/HomePage').then((module) => ({ default: module.HomePage })),
)
const BookDetailsPage = lazy(() =>
  import('@/pages/BookDetailsPage').then((module) => ({ default: module.BookDetailsPage })),
)
const CheckoutPage = lazy(() =>
  import('@/pages/CheckoutPage').then((module) => ({ default: module.CheckoutPage })),
)
const PaymentSuccessPage = lazy(() =>
  import('@/pages/PaymentSuccessPage').then((module) => ({
    default: module.PaymentSuccessPage,
  })),
)
const PaymentFailurePage = lazy(() =>
  import('@/pages/PaymentFailurePage').then((module) => ({
    default: module.PaymentFailurePage,
  })),
)
const PrivacyPolicyPage = lazy(() =>
  import('@/pages/PrivacyPolicyPage').then((module) => ({
    default: module.PrivacyPolicyPage,
  })),
)
const TermsPage = lazy(() =>
  import('@/pages/TermsPage').then((module) => ({ default: module.TermsPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.bookDetails} element={<BookDetailsPage />} />
        </Route>

        <Route element={<CheckoutLayout />}>
          <Route path={ROUTES.checkout} element={<CheckoutPage />} />
          <Route path={ROUTES.paymentSuccess} element={<PaymentSuccessPage />} />
          <Route path={ROUTES.paymentFailure} element={<PaymentFailurePage />} />
        </Route>

        <Route element={<LegalLayout />}>
          <Route path={ROUTES.privacy} element={<PrivacyPolicyPage />} />
          <Route path={ROUTES.terms} element={<TermsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
