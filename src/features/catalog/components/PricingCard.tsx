import { motion } from 'framer-motion'
import { FiBook, FiCheckCircle, FiGift, FiTablet } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import type { ProductVariant } from '@/features/catalog/types/catalog.types'
import { formatCurrency } from '@/utils/currency'
import { cn } from '@/utils/cn'

interface PricingCardProps {
  product: ProductVariant
  featured?: boolean
  onSelect: (product: ProductVariant) => void
}

function getHighlights(product: ProductVariant) {
  const highlights = [product.deliveryEstimate]

  if (!product.shippingRequired) {
    highlights.push('Entrega digital imediata')
    highlights.push('Leitura em dispositivos compativeis')
  } else {
    highlights.push(product.autographAvailable ? 'Pode incluir dedicacao' : 'Edicao impressa premium')
  }

  if (product.giftsIncluded?.length) {
    highlights.push(product.giftsIncluded.join(', '))
  }

  return highlights.slice(0, 4)
}

export function PricingCard({
  product,
  featured = false,
  onSelect,
}: PricingCardProps) {
  const Icon = product.shippingRequired ? FiBook : FiTablet
  const highlights = getHighlights(product)

  return (
    <motion.article whileHover={{ y: -10 }} className="relative group h-full">
      {featured ? (
        <div className="absolute -inset-1 rounded-lg bg-linear-to-r from-silver-400 via-mystic-500 to-silver-300 blur opacity-25 transition-opacity group-hover:opacity-45" />
      ) : null}

      <div
        className={cn(
          'relative flex h-full flex-col items-center rounded-lg border p-10 text-center transition-all',
          featured
            ? 'border-silver-400/20 bg-forest-500'
            : 'border-white/5 bg-forest-600 hover:border-nymph-400/30',
        )}
      >
        {featured ? (
          <div className="absolute -top-4 rounded-full bg-mystic-500 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-forest-950">
            Mais vendido
          </div>
        ) : null}

        <div className={cn('mb-6 rounded-full p-4', featured ? 'text-silver-300' : 'text-nymph-400')}>
          <Icon className="size-12" />
        </div>

        <h3 className="font-display text-2xl font-bold text-white">{product.name}</h3>
        <p className="mb-6 mt-2 text-white/60">{product.description}</p>
        <div className="mb-8 text-4xl font-bold text-white">{formatCurrency(product.price)}</div>

        <ul className="mb-10 w-full space-y-4 text-left text-sm text-white/70">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-3">
              {product.giftsIncluded?.includes(item) ? (
                <FiGift className={cn('size-5 shrink-0', featured ? 'text-mystic-400' : 'text-nymph-400')} />
              ) : (
                <FiCheckCircle className={cn('size-5 shrink-0', featured ? 'text-mystic-400' : 'text-nymph-400')} />
              )}
              {item}
            </li>
          ))}
        </ul>

        <Button
          className={cn(
            'w-full rounded-xl py-4 cursor-pointer',
            featured
              ? 'bg-linear-to-r from-silver-300 to-silver-200 text-forest-900 hover:brightness-110'
              : 'border border-nymph-400 bg-transparent text-nymph-300 hover:bg-nymph-400/10',
          )}
          type="button"
          variant="ghost"
          onClick={() => onSelect(product)}
        >
          Comprar agora
        </Button>
      </div>
    </motion.article>
  )
}
