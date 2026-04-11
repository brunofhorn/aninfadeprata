import { motion } from 'framer-motion'
import { FiEye, FiMusic } from 'react-icons/fi'
import { LuSparkles } from 'react-icons/lu'
import type { ChapterPreview } from '@/features/catalog/types/catalog.types'

interface ChapterCardProps {
  chapter: ChapterPreview
  index: number
}

function getChapterIcon(icon: ChapterPreview['icon']) {
  switch (icon) {
    case 'eye':
      return <FiEye className="size-5" />
    case 'music':
      return <FiMusic className="size-5" />
    case 'sparkles':
    default:
      return <LuSparkles className="size-5" />
  }
}

export function ChapterCard({ chapter, index }: ChapterCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.3 }}
      className="group flex cursor-pointer items-center gap-6 rounded-[1.75rem] border border-white/5 bg-white/3 p-6 transition-colors hover:bg-forest-600"
    >
      <span className="font-display text-3xl font-bold text-mystic-500/30 transition-colors group-hover:text-mystic-400">
        {chapter.id}
      </span>
      <div className="flex-1">
        <h3 className="font-display text-xl font-bold text-white">{chapter.title}</h3>
        <p className="text-sm text-white/60">{chapter.description}</p>
      </div>
      <div className="text-nymph-400 opacity-50 transition-opacity group-hover:opacity-100">
        {getChapterIcon(chapter.icon)}
      </div>
    </motion.article>
  )
}
