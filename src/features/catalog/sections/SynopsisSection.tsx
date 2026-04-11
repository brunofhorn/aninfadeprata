import { SectionHeader } from '@/components/common/SectionHeader'
import type { Book } from '@/features/catalog/types/catalog.types'

interface SynopsisSectionProps {
  book: Book
}

export function SynopsisSection({ book }: SynopsisSectionProps) {
  return (
    <section id="sinopse" className="page-shell section-spacing grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
      <SectionHeader
        eyebrow="Sinopse"
        title="Uma narrativa que mistura fantasia, memoria e delicadeza emocional."
        description={book.description}
      />

      <div className="surface-card p-8 sm:p-10">
        <p className="text-lg text-brand-700">{book.synopsis}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {book.categories.map((category) => (
            <div key={category} className="rounded-2xl bg-brand-100 px-4 py-5 text-center">
              <p className="text-sm font-semibold text-brand-800">{category}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
