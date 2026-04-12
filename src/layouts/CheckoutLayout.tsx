import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/common/Navbar'
import { useScrollToTop } from '@/hooks/useScrollToTop'

export function CheckoutLayout() {
  useScrollToTop()

  return (
    <div className="relative min-h-screen overflow-hidden bg-forest-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-mystic-700/30 blur-[110px]" />
        <div className="absolute right-[-5rem] top-56 h-80 w-80 rounded-full bg-nymph-500/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-silver-300/10 blur-[110px]" />
      </div>

      <Navbar minimal minimalTheme="dark" />
      <main className="page-shell relative z-10 py-10 sm:py-14">
        <Outlet />
      </main>
    </div>
  )
}
