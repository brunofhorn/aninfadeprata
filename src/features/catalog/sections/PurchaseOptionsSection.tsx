import { PricingCard } from '@/features/catalog/components/PricingCard'
import type { ProductVariant } from '@/features/catalog/types/catalog.types'

interface PurchaseOptionsSectionProps {
  products: ProductVariant[]
  onSelect: (product: ProductVariant) => void
}

export function PurchaseOptionsSection({
  products,
  onSelect,
}: PurchaseOptionsSectionProps) {
  return (
    <section id="comprar" className="relative overflow-hidden bg-forest-900 py-24 text-white">
      <div className="page-shell max-w-6xl">
        <h2 className="mb-16 text-center font-display text-4xl font-bold">
          Traga a magia para casa
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <PricingCard
              key={product.id}
              featured={index === 2 || index === products.length - 1}
              product={product}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
