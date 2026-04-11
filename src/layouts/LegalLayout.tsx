import { Outlet } from 'react-router-dom'
import { Footer } from '@/components/common/Footer'
import { Navbar } from '@/components/common/Navbar'
import { useScrollToTop } from '@/hooks/useScrollToTop'

export function LegalLayout() {
  useScrollToTop()

  return (
    <div className="min-h-screen">
      <Navbar minimal />
      <main className="page-shell py-12 sm:py-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
