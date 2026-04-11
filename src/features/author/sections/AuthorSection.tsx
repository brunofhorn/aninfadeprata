import { FiArrowUpRight } from 'react-icons/fi'
import { SectionHeader } from '@/components/common/SectionHeader'
import type { Author } from '@/features/catalog/types/catalog.types'

interface AuthorSectionProps {
  author: Author
}

export function AuthorSection({ author }: AuthorSectionProps) {
  return (
    <section className="page-shell section-spacing grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="surface-card flex items-center justify-center p-8">
        <div className="flex size-52 items-center justify-center rounded-full bg-linear-to-br from-brand-200 to-brand-400 text-center font-display text-4xl text-brand-950">
          HM
        </div>
      </div>

      <div>
        <SectionHeader eyebrow="Autora" title={author.name} description={author.headline} />
        <p className="mt-5 text-brand-700">{author.bio}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {author.socialLinks.map((link) => (
            <a
              key={link.label}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-brand-800 shadow-soft hover:bg-brand-100"
              href={link.url}
              rel="noreferrer"
              target="_blank"
            >
              {link.label}
              <FiArrowUpRight />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
