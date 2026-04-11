import { WorldCard } from '@/features/catalog/components/WorldCard'
import type { Character, Location } from '@/features/catalog/types/catalog.types'

interface WorldSectionProps {
  characters: Character[]
  locations: Location[]
}

export function WorldSection({ characters, locations }: WorldSectionProps) {
  const showcase = [...characters, ...locations].slice(0, 6)

  return (
    <section id="mundo" className="bg-forest-900 py-24 text-white">
      <div className="page-shell">
        <h2 className="mb-12 text-center font-display text-4xl font-bold">
          Habitantes e cenarios do bosque
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {showcase.map((item, index) => (
            <WorldCard key={item.id} entity={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
