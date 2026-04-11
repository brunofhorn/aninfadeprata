import { Link, useLocation } from 'react-router-dom'
import { FiBook, FiInstagram, FiMail } from 'react-icons/fi'
import { BrandWordmark } from '@/components/common/BrandWordmark'
import { ROUTES } from '@/constants/routes'
import { IoLogoTiktok } from 'react-icons/io5'

export function Footer() {
  const { pathname } = useLocation()
  const isHome = pathname === ROUTES.home

  if (isHome) {
    return (
      <footer className="border-t border-white/5 bg-forest-950 py-12 text-white">
        <div className="page-shell flex flex-col items-center space-y-6 text-center">
          <h2>
            <BrandWordmark className="text-3xl font-bold text-white" />
          </h2>
          <div className="flex gap-3">
            <a
              className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-mystic-500 hover:text-forest-950"
              href="mailto:contato@aninfadeprata.com"
            >
              <FiMail />
            </a>
            <a
              className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-mystic-500 hover:text-forest-950"
              href="https://instagram.com/saraborgesch"
              rel="noreferrer"
              target="_blank"
            >
              <FiInstagram />
            </a>
            <a
              className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-mystic-500 hover:text-forest-950"
              href="https://tiktok.com/@saraborgesch"
              rel="noreferrer"
              target="_blank"
            >
              <IoLogoTiktok />
            </a>
            <a
              className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-mystic-500 hover:text-forest-950"
              href="https://www.skoob.com.br/pt/author/78306"
              rel="noreferrer"
              target="_blank"
            >
              <FiBook />
            </a>
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/30">
            © 2026 Sara Borges. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-brand-100 py-10">
      <div className="page-shell flex flex-col gap-6 text-sm text-brand-600 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p>
            <BrandWordmark className="text-xl text-brand-950" />
          </p>
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
