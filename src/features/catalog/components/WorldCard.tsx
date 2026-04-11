import { motion } from 'framer-motion'
import type { Character, Location } from '@/features/catalog/types/catalog.types'
import { cn } from '@/utils/cn'

type WorldEntity = Character | Location

interface WorldCardProps {
  entity: WorldEntity
  index: number
}

export function WorldCard({ entity, index }: WorldCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.25 }}
      className={cn(
        'group relative h-[400px] overflow-hidden rounded-[1.75rem]',
        entity.gridSpan,
      )}
    >
      <img
        alt={entity.name}
        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        referrerPolicy="no-referrer"
        src={entity.imageUrl}
      />
      <div className="absolute inset-0 bg-linear-to-t from-forest-950 via-forest-950/20 to-transparent opacity-90" />
      <div className="absolute bottom-0 p-8">
        <h3 className="font-display text-2xl font-bold text-white">{entity.name}</h3>
        {'role' in entity ? (
          <p className="font-medium text-nymph-300/90">{entity.role}</p>
        ) : null}
        <p className="mt-2 max-w-md text-sm text-white/70">{entity.description}</p>
      </div>
    </motion.article>
  )
}
