import { motion } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import type { FaqItem } from '@/features/catalog/types/catalog.types'
import { cn } from '@/utils/cn'

interface FaqAccordionItemProps {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
}

export function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: FaqAccordionItemProps) {
  return (
    <div className="rounded-[1.75rem] border border-white/5 bg-forest-700 p-6">
      <button
        className="flex w-full items-center justify-between gap-4 text-left"
        type="button"
        onClick={onToggle}
      >
        <span className="font-display text-lg font-bold text-white">{item.question}</span>
        <FiChevronDown
          className={cn(
            'size-5 shrink-0 text-mystic-400 transition-transform cursor-pointer',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen ? (
        <motion.p
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-4 overflow-hidden text-white/65"
        >
          {item.answer}
        </motion.p>
      ) : null}
    </div>
  )
}
