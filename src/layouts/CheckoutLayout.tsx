import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/common/Navbar'
import { useScrollToTop } from '@/hooks/useScrollToTop'

export function CheckoutLayout() {
  useScrollToTop()

  return (
    <div className="min-h-screen">
      <Navbar minimal />
      <main className="page-shell py-10 sm:py-14">
        <Outlet />
      </main>
    </div>
  )
}
