import { Link, useLocation } from 'react-router-dom'
import { FiGlobe, FiMail } from 'react-icons/fi'
import { ROUTES } from '@/constants/routes'

export function Footer() {
  const { pathname } = useLocation()
  const isHome = pathname === ROUTES.home

  if (isHome) {
    return (
      <footer className="border-t border-white/5 bg-forest-950 py-12 text-white">
        <div className="page-shell flex flex-col items-center space-y-6 text-center">
          <h2 className="font-display text-xl font-bold text-white">A Ninfa de Prata</h2>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <Link
              className="text-xs font-bold uppercase tracking-[0.22em] text-white/40 transition-colors hover:text-silver-300"
              to={ROUTES.privacy}
            >
              Privacidade
            </Link>
            <Link
              className="text-xs font-bold uppercase tracking-[0.22em] text-white/40 transition-colors hover:text-silver-300"
              to={ROUTES.terms}
            >
              Termos
            </Link>
            <a
              className="text-xs font-bold uppercase tracking-[0.22em] text-white/40 transition-colors hover:text-silver-300"
              href="#contato"
            >
              Contato
            </a>
          </div>
          <div className="flex gap-3">
            <a
              className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-mystic-500 hover:text-forest-950"
              href="mailto:contato@aninfadeprata.com"
            >
              <FiMail />
            </a>
            <a
              className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-mystic-500 hover:text-forest-950"
              href="https://example.com"
              rel="noreferrer"
              target="_blank"
            >
              <FiGlobe />
            </a>
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/30">
            © 2026 Helena Maris. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-brand-100 py-10">
      <div className="page-shell flex flex-col gap-6 text-sm text-brand-600 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xl text-brand-950">A Ninfa de Prata</p>
          <p>Projeto comercial preparado para crescer com catalogo, cupons e area da cliente.</p>
        </div>

        <div className="flex gap-4">
          <Link to={ROUTES.privacy}>Privacidade</Link>
          <Link to={ROUTES.terms}>Termos</Link>
        </div>
      </div>
    </footer>
  )
}
