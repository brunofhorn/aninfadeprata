import { useNavigate } from 'react-router-dom'
import { BrandWordmark } from '@/components/common/BrandWordmark'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'
import { useBook } from '@/features/catalog/hooks/useBook'
import { PurchaseOptionsSection } from '@/features/catalog/sections/PurchaseOptionsSection'
import { WorldSection } from '@/features/catalog/sections/WorldSection'
import type { ProductVariant } from '@/features/catalog/types/catalog.types'
import { useCheckout } from '@/features/checkout/hooks/useCheckout'

export function BookDetailsPage() {
  const navigate = useNavigate()
  const { data: book, isLoading } = useBook()
  const { setSelectedProduct } = useCheckout()

  const handleSelectProduct = (product: ProductVariant) => {
    setSelectedProduct(product)
    navigate(ROUTES.checkout)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!book) {
    return (
      <div className="page-shell py-16">
        <ErrorState
          title="Livro nao encontrado"
          description="Nao foi possivel carregar os detalhes do catalogo."
        />
      </div>
    )
  }

  return (
    <>
      <Seo title={`${book.title} | Detalhes`} description={book.pitch} />
      <section className="page-shell section-spacing grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div className="surface-card p-8 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-500">
            Detalhes do livro
          </p>
          <h1 className="mt-3 text-5xl leading-tight">
            <BrandWordmark className="text-5xl" name={book.title} />
          </h1>
          <p className="mt-4 text-xl text-brand-600">{book.subtitle}</p>
          <p className="mt-6 text-brand-700">{book.pitch}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-brand-100 p-4">
              <p className="text-sm text-brand-500">ISBN</p>
              <p className="mt-1 font-semibold text-brand-950">{book.isbn}</p>
            </div>
            <div className="rounded-2xl bg-brand-100 p-4">
              <p className="text-sm text-brand-500">Paginas</p>
              <p className="mt-1 font-semibold text-brand-950">{book.pageCount}</p>
            </div>
            <div className="rounded-2xl bg-brand-100 p-4">
              <p className="text-sm text-brand-500">Idioma</p>
              <p className="mt-1 font-semibold text-brand-950">{book.language}</p>
            </div>
            <div className="rounded-2xl bg-brand-100 p-4">
              <p className="text-sm text-brand-500">Publicacao</p>
              <p className="mt-1 font-semibold text-brand-950">{book.publicationYear}</p>
            </div>
          </div>
        </div>

        <div className="surface-card p-8">
          <h2 className="text-3xl">Sinopse estendida</h2>
          <p className="mt-4 text-brand-700">{book.synopsis}</p>
          <Button className="mt-8" onClick={() => navigate(ROUTES.home)}>
            Voltar para a landing
          </Button>
        </div>
      </section>

      <WorldSection characters={book.characters} locations={book.locations} />
      <PurchaseOptionsSection products={book.variants} onSelect={handleSelectProduct} />
    </>
  )
}
