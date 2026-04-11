import { SectionHeader } from '@/components/common/SectionHeader'
import { ProductOptionCard } from '@/features/catalog/components/ProductOptionCard'
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
    <section id="edicoes" className="page-shell section-spacing">
      <SectionHeader
        eyebrow="Formatos de compra"
        title="Escolha a experiencia de leitura que faz mais sentido agora."
        description="A arquitetura de checkout ja nasce preparada para itens digitais, livros fisicos, autografos e kits especiais."
        align="center"
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductOptionCard key={product.id} product={product} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}
