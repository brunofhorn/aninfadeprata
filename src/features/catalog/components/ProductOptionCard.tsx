import { motion } from 'framer-motion'
import { FiCheckCircle, FiPackage, FiPenTool, FiSmartphone } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import type { ProductVariant } from '@/features/catalog/types/catalog.types'
import { formatCurrency } from '@/utils/currency'

interface ProductOptionCardProps {
  product: ProductVariant
  onSelect: (product: ProductVariant) => void
}

export function ProductOptionCard({ product, onSelect }: ProductOptionCardProps) {
  return (
    <motion.article whileHover={{ y: -6 }} className="surface-card flex h-full flex-col p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-500">
            {product.shippingRequired ? 'Edicao fisica' : 'Edicao digital'}
          </p>
          <h3 className="mt-2 text-2xl">{product.name}</h3>
        </div>
        <div className="rounded-full bg-brand-100 p-3 text-brand-700">
          {product.shippingRequired ? (
            product.autographAvailable ? (
              <FiPenTool />
            ) : (
              <FiPackage />
            )
          ) : (
            <FiSmartphone />
          )}
        </div>
      </div>

      <p className="text-sm text-brand-700">{product.description}</p>

      <div className="mt-5 flex items-end gap-3">
        <p className="text-3xl font-extrabold text-brand-950">{formatCurrency(product.price)}</p>
        {product.compareAtPrice ? (
          <span className="pb-1 text-sm text-brand-400 line-through">
            {formatCurrency(product.compareAtPrice)}
          </span>
        ) : null}
      </div>

      <ul className="mt-5 space-y-3 text-sm text-brand-700">
        <li className="flex gap-2">
          <FiCheckCircle className="mt-1 shrink-0 text-accent-600" />
          {product.deliveryEstimate}
        </li>
        <li className="flex gap-2">
          <FiCheckCircle className="mt-1 shrink-0 text-accent-600" />
          {product.autographAvailable ? 'Permite dedicacao opcional.' : 'Compra simplificada.'}
        </li>
        {product.giftsIncluded?.length ? (
          <li className="flex gap-2">
            <FiCheckCircle className="mt-1 shrink-0 text-accent-600" />
            Inclui {product.giftsIncluded.join(', ')}.
          </li>
        ) : null}
      </ul>

      <Button className="mt-6" fullWidth onClick={() => onSelect(product)}>
        Comprar agora
      </Button>
    </motion.article>
  )
}
