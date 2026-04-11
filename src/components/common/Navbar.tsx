import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FiBookOpen,
  FiMenu,
  FiShoppingBag,
  FiX,
} from 'react-icons/fi'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

interface NavbarProps {
  minimal?: boolean
}

const landingLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#sinopse', label: 'Sinopse' },
  { href: '#capitulos', label: 'Capitulos' },
  { href: '#mundo', label: 'Mundo' },
  { href: '#comprar', label: 'Comprar' },
] as const

export function Navbar({ minimal = false }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === ROUTES.home

  if (minimal) {
    return (
      <header className="sticky top-0 z-40 border-b border-white/70 bg-brand-50/90 backdrop-blur">
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

          <Link to={ROUTES.checkout}>
            <Button variant="secondary">
              <FiShoppingBag />
              Checkout
            </Button>
          </Link>
        </div>
      </header>
    )
  }

  if (isHome) {
    return (
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-forest-900/80 backdrop-blur-xl">
        <div className="page-shell flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <button
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              className="text-nymph-400 md:hidden"
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <FiX className="size-6" /> : <FiMenu className="size-6" />}
            </button>

            <Link to={ROUTES.home}>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(192,192,192,0.4)]">
                A Ninfa de Prata
              </h1>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {landingLinks.map((item) => (
              <a
                key={item.href}
                className="font-display text-sm tracking-wide text-white/70 hover:text-white"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <Link to={ROUTES.checkout} className="hidden md:inline-flex">
            <FiBookOpen className="size-6 text-nymph-400" />
          </Link>
        </div>

        {mobileOpen ? (
          <div className="border-t border-white/5 bg-forest-950/95 px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              {landingLinks.map((item) => (
                <a
                  key={item.href}
                  className="font-display text-sm tracking-wide text-white/75"
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        ) : null}
      </header>
    )
  }

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

        <nav className="hidden items-center gap-6 text-sm font-medium text-brand-700 md:flex">
          <a href="/#sinopse">Sinopse</a>
          <a href="/#comprar">Comprar</a>
          <Link to={ROUTES.bookDetails}>Detalhes</Link>
          <a href="/#faq">FAQ</a>
        </nav>

        <Link to={ROUTES.checkout}>
          <Button className={cn('hidden sm:inline-flex')} variant="secondary">
            <FiShoppingBag />
            Comprar
          </Button>
        </Link>
      </div>
    </header>
  )
}
