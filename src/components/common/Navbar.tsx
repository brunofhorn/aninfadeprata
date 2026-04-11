import { Link } from 'react-router-dom'
import { FiBookOpen, FiShoppingBag } from 'react-icons/fi'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/Button'

interface NavbarProps {
  minimal?: boolean
}

export function Navbar({ minimal = false }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-brand-50/90 backdrop-blur">
      <div className="page-shell flex items-center justify-between py-4">
        <Link className="flex items-center gap-3 text-brand-950" to={ROUTES.home}>
          <div className="flex size-11 items-center justify-center rounded-full bg-brand-900 text-brand-50">
            <FiBookOpen />
          </div>
          <div>
            <p className="font-display text-lg leading-none">A Ninfa de Prata</p>
            <p className="text-xs uppercase tracking-[0.24em] text-brand-500">Livro oficial</p>
          </div>
        </Link>

        {minimal ? (
          <Link to={ROUTES.checkout}>
            <Button variant="secondary">
              <FiShoppingBag />
              Checkout
            </Button>
          </Link>
        ) : (
          <nav className="hidden items-center gap-6 text-sm font-medium text-brand-700 md:flex">
            <a href="/#sinopse">Sinopse</a>
            <a href="/#edicoes">Edicoes</a>
            <Link to={ROUTES.bookDetails}>Detalhes</Link>
            <a href="/#faq">FAQ</a>
          </nav>
        )}
      </div>
    </header>
  )
}
