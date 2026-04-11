import { SectionHeader } from '@/components/common/SectionHeader'
import type { Character, Location } from '@/features/catalog/types/catalog.types'

interface WorldSectionProps {
  characters: Character[]
  locations: Location[]
}

export function WorldSection({ characters, locations }: WorldSectionProps) {
  return (
    <section className="page-shell section-spacing grid gap-12 lg:grid-cols-2">
      <div>
        <SectionHeader
          eyebrow="Personagens"
          title="Presencas que conduzem a tensao, o afeto e o misterio."
        />
        <div className="mt-6 space-y-4">
          {characters.map((character) => (
            <article key={character.id} className="surface-card p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-500">
                {character.role}
              </p>
              <h3 className="mt-2 text-2xl">{character.name}</h3>
              <p className="mt-3 text-brand-700">{character.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader
          eyebrow="Locais"
          title="Cenarios com identidade visual forte para sustentar a comunicacao comercial."
        />
        <div className="mt-6 space-y-4">
          {locations.map((location) => (
            <article key={location.id} className="surface-card p-6">
              <h3 className="text-2xl">{location.name}</h3>
              <p className="mt-3 text-brand-700">{location.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
