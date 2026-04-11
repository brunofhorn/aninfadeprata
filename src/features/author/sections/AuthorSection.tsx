import { FiGlobe, FiMail } from 'react-icons/fi'
import type { Author } from '@/features/catalog/types/catalog.types'

interface AuthorSectionProps {
  author: Author
}

export function AuthorSection({ author }: AuthorSectionProps) {
  return (
    <section className="bg-forest-800 py-24 text-white">
      <div className="page-shell">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row">
          <div className="relative h-64 w-64 shrink-0 md:h-80 md:w-80">
            <div className="absolute inset-0 rounded-full bg-mystic-500 blur-3xl opacity-20" />
            <img
              alt={author.name}
              className="relative z-10 h-full w-full rounded-full border-4 border-forest-900 object-cover shadow-2xl"
              referrerPolicy="no-referrer"
              src={author.photoUrl}
            />
          </div>

          <div className="flex-1 space-y-6">
            <h2 className="font-display text-4xl font-bold">Sobre a autora</h2>
            <h3 className="font-display text-2xl italic text-nymph-300">{author.name}</h3>
            <p className="text-lg leading-relaxed text-white/70">{author.bio}</p>
            <div className="flex gap-4">
              <a
                className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-700 transition-all hover:bg-mystic-500 hover:text-forest-900"
                href="mailto:contato@aninfadeprata.com"
              >
                <FiMail className="size-4" />
              </a>
              <a
                className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-700 transition-all hover:bg-mystic-500 hover:text-forest-900"
                href={author.socialLinks[1]?.url ?? 'https://example.com'}
                rel="noreferrer"
                target="_blank"
              >
                <FiGlobe className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
