import { FiCheckCircle } from 'react-icons/fi'
import type { ProductVariant } from '@/features/catalog/types/catalog.types'
import { formatCurrency } from '@/utils/currency'

interface CheckoutSummaryProps {
  product: ProductVariant
}

export function CheckoutSummary({ product }: CheckoutSummaryProps) {
  return (
    <aside className="dark-surface-card h-fit p-6 lg:sticky lg:top-28">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-300/70">Resumo</p>
      <h2 className="mt-3 text-3xl text-white">{product.name}</h2>
      <p className="mt-3 text-white/65">{product.description}</p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center justify-between text-sm text-white/60">
          <span>Produto</span>
          <span>1x</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold text-white">Total</span>
          <span className="text-2xl font-extrabold text-white">
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>

      <ul className="mt-6 space-y-3 text-sm text-white/68">
        <li className="flex gap-3">
          <FiCheckCircle className="mt-1 shrink-0 text-nymph-300" />
          Entrega: {product.deliveryEstimate}
        </li>
        <li className="flex gap-3">
          <FiCheckCircle className="mt-1 shrink-0 text-nymph-300" />
          {product.shippingRequired ? 'Endereco obrigatorio' : 'Sem frete'}
        </li>
        <li className="flex gap-3">
          <FiCheckCircle className="mt-1 shrink-0 text-nymph-300" />
          {product.autographAvailable ? 'Aceita dedicacao' : 'Checkout direto'}
        </li>
      </ul>
    </aside>
  )
}
