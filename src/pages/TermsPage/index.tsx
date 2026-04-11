import { Seo } from '@/components/common/Seo'

export function TermsPage() {
  return (
    <>
      <Seo title="Termos de uso" description="Termos de uso e compra do projeto." />
      <article className="surface-card mx-auto max-w-4xl p-8 sm:p-10">
        <h1 className="text-4xl">Termos de uso e compra</h1>
        <p className="mt-6 text-brand-700">
          Esta pagina deve consolidar regras de compra, politica de entrega, reembolso, prazos de postagem, formatos digitais, suporte e condicoes especificas para exemplares autografados e kits com brindes.
        </p>
        <p className="mt-4 text-brand-700">
          Em uma evolucao futura, vale separar termos gerais, politica comercial e politica de trocas para facilitar manutencao e auditoria juridica.
        </p>
      </article>
    </>
  )
}
