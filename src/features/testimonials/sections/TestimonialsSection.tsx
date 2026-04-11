import { FiMessageSquare } from 'react-icons/fi'
import { SectionHeader } from '@/components/common/SectionHeader'
import type { Testimonial } from '@/features/catalog/types/catalog.types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="page-shell section-spacing">
      <SectionHeader
        eyebrow="Leitoras e parceiros"
        title="Prova social pronta para apoiar a conversao da landing."
        align="center"
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article key={testimonial.id} className="surface-card p-6">
            <FiMessageSquare className="text-brand-500" />
            <p className="mt-4 text-lg text-brand-800">{testimonial.text}</p>
            <div className="mt-6 border-t border-brand-100 pt-4">
              <p className="font-semibold text-brand-950">{testimonial.authorName}</p>
              <p className="text-sm text-brand-500">{testimonial.highlight}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
