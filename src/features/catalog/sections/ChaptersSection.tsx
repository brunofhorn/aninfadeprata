import { ChapterCard } from '@/features/catalog/components/ChapterCard'
import type { ChapterPreview } from '@/features/catalog/types/catalog.types'

interface ChaptersSectionProps {
  chapters: ChapterPreview[]
}

export function ChaptersSection({ chapters }: ChaptersSectionProps) {
  return (
    <section id="capitulos" className="bg-forest-800 py-24 text-white">
      <div className="page-shell">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center font-display text-4xl font-bold">
            Cronicas da floresta
          </h2>
          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <ChapterCard key={chapter.id} chapter={chapter} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
