import { Seo } from '@/components/common/Seo'

export function PrivacyPolicyPage() {
  return (
    <>
      <Seo title="Politica de privacidade" description="Politica de privacidade do projeto." />
      <article className="surface-card mx-auto max-w-4xl p-8 sm:p-10">
        <h1 className="text-4xl">Politica de privacidade</h1>
        <p className="mt-6 text-brand-700">
          Esta pagina serve como base para a versao juridica real. O projeto deve informar com transparencia quais dados sao coletados, por qual motivo, por quanto tempo e com quais parceiros de pagamento e logistica eles podem ser compartilhados.
        </p>
        <p className="mt-4 text-brand-700">
          Em producao, inclua controlador dos dados, canal de contato, direitos da pessoa titular, politica de cookies e referencias completas a meios de pagamento e antifraude, se houver.
        </p>
      </article>
    </>
  )
}
