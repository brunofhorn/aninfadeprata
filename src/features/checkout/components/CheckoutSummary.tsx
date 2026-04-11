import type { ProductVariant } from '@/features/catalog/types/catalog.types'
import { formatCurrency } from '@/utils/currency'

interface CheckoutSummaryProps {
  product: ProductVariant
}

export function CheckoutSummary({ product }: CheckoutSummaryProps) {
  return (
    <aside className="surface-card h-fit p-6 lg:sticky lg:top-24">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-500">Resumo</p>
      <h2 className="mt-3 text-3xl">{product.name}</h2>
      <p className="mt-3 text-brand-700">{product.description}</p>

      <div className="mt-6 rounded-2xl bg-brand-100 p-4">
        <div className="flex items-center justify-between text-sm text-brand-700">
          <span>Produto</span>
          <span>1x</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold text-brand-950">Total</span>
          <span className="text-2xl font-extrabold text-brand-950">
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>

      <ul className="mt-6 space-y-3 text-sm text-brand-700">
        <li>Entrega: {product.deliveryEstimate}</li>
        <li>{product.shippingRequired ? 'Endereco obrigatorio' : 'Sem frete'}</li>
        <li>{product.autographAvailable ? 'Aceita dedicacao' : 'Checkout direto'}</li>
      </ul>
    </aside>
  )
}
