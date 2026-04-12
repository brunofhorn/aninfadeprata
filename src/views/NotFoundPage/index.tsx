'use client'

import Link from 'next/link'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

export function NotFoundPage() {
  return (
    <>
      <Seo title="Pagina nao encontrada" description="A rota solicitada nao existe." />
      <section className="page-shell py-20">
        <div className="surface-card mx-auto max-w-2xl p-10 text-center">
          <h1 className="text-5xl">404</h1>
          <p className="mt-4 text-brand-700">
            A pagina nao existe ou foi movida dentro da estrutura do projeto.
          </p>
          <Link className="mt-8 inline-flex" href={ROUTES.home}>
            <Button>Voltar para a home</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
