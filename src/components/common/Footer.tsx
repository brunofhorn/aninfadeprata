import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function Footer() {
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
