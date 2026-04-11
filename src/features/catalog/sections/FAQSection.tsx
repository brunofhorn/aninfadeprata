import { SectionHeader } from '@/components/common/SectionHeader'
import type { FaqItem } from '@/features/catalog/types/catalog.types'

interface FAQSectionProps {
  items: FaqItem[]
}

export function FAQSection({ items }: FAQSectionProps) {
  return (
    <section id="faq" className="page-shell section-spacing">
      <SectionHeader
        eyebrow="FAQ"
        title="Respostas para as duvidas que mais impactam a decisao de compra."
      />

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <details key={item.id} className="surface-card p-6">
            <summary className="cursor-pointer list-none font-semibold text-brand-950">
              {item.question}
            </summary>
            <p className="mt-4 text-brand-700">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
