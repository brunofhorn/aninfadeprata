import { useState } from 'react'
import { FaqAccordionItem } from '@/features/catalog/components/FaqAccordionItem'
import type { FaqItem } from '@/features/catalog/types/catalog.types'

interface FAQSectionProps {
  items: FaqItem[]
}

export function FAQSection({ items }: FAQSectionProps) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-forest-900 py-24 text-white">
      <div className="page-shell max-w-3xl">
        <h2 className="mb-12 text-center font-display text-4xl font-bold text-white">
          Dúvidas comuns
        </h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <FaqAccordionItem
              key={item.id}
              isOpen={open === index}
              item={item}
              onToggle={() => setOpen(open === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
