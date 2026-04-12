'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FiBookOpen,
  FiMenu,
  FiShoppingBag,
  FiX,
} from 'react-icons/fi'
import { BrandWordmark } from '@/components/common/BrandWordmark'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

interface NavbarProps {
  minimal?: boolean
  minimalTheme?: 'light' | 'dark'
}

const landingLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#sinopse', label: 'Sinopse' },
  { href: '#capitulos', label: 'Capitulos' },
  { href: '#mundo', label: 'Mundo' },
  { href: '#comprar', label: 'Comprar' },
] as const

export function Navbar({
  minimal = false,
  minimalTheme = 'light',
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === ROUTES.home

  if (minimal) {
    const isDarkMinimal = minimalTheme === 'dark'

    return (
      <header
        className={cn(
          'sticky top-0 z-40 border-b backdrop-blur-xl',
          isDarkMinimal
            ? 'border-white/8 bg-forest-950/80'
            : 'border-white/70 bg-brand-50/90',
        )}
      >
        <div className="page-shell flex items-center justify-between py-4">
          <Link
            className={cn(
              'flex items-center gap-3',
              isDarkMinimal ? 'text-white' : 'text-brand-950',
            )}
            href={ROUTES.home}
          >
            <div
              className={cn(
                'flex size-11 items-center justify-center rounded-full',
                isDarkMinimal
                  ? 'border border-nymph-400/30 bg-white/8 text-nymph-300'
                  : 'bg-brand-900 text-brand-50',
              )}
            >
              <FiBookOpen />
            </div>
            <div>
              <BrandWordmark className="text-lg leading-none" />
              <p
                className={cn(
                  'text-xs uppercase tracking-[0.24em]',
                  isDarkMinimal ? 'text-white/45' : 'text-brand-500',
                )}
              >
                Livro oficial
              </p>
            </div>
          </Link>

          <Link href={ROUTES.checkout}>
            <Button
              className={cn(
                isDarkMinimal &&
                  'border border-nymph-400/30 bg-white/6 text-nymph-300 hover:bg-nymph-400/12',
              )}
              variant={isDarkMinimal ? 'ghost' : 'secondary'}
            >
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

            <Link href={ROUTES.home}>
              <BrandWordmark className="text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(192,192,192,0.4)]" />
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

          <Link href={ROUTES.checkout} className="hidden md:inline-flex">
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
        <Link className="flex items-center gap-3 text-brand-950" href={ROUTES.home}>
          <div className="flex size-11 items-center justify-center rounded-full bg-brand-900 text-brand-50">
            <FiBookOpen />
          </div>
          <div>
            <BrandWordmark className="text-lg leading-none" />
            <p className="text-xs uppercase tracking-[0.24em] text-brand-500">Livro oficial</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-brand-700 md:flex">
          <a href={`${ROUTES.home}#sinopse`}>Sinopse</a>
          <a href={`${ROUTES.home}#comprar`}>Comprar</a>
          <Link href={ROUTES.bookDetails}>Detalhes</Link>
          <a href={`${ROUTES.home}#faq`}>FAQ</a>
        </nav>

        <Link href={ROUTES.checkout}>
          <Button className={cn('hidden sm:inline-flex')} variant="secondary">
            <FiShoppingBag />
            Comprar
          </Button>
        </Link>
      </div>
    </header>
  )
}
