import { useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Seo } from '@/components/common/Seo'
import { ROUTES } from '@/constants/routes'
import { AuthorSection } from '@/features/author/sections/AuthorSection'
import { useBook } from '@/features/catalog/hooks/useBook'
import { FAQSection } from '@/features/catalog/sections/FAQSection'
import { HeroSection } from '@/features/catalog/sections/HeroSection'
import { PurchaseOptionsSection } from '@/features/catalog/sections/PurchaseOptionsSection'
import { SynopsisSection } from '@/features/catalog/sections/SynopsisSection'
import { WorldSection } from '@/features/catalog/sections/WorldSection'
import type { ProductVariant } from '@/features/catalog/types/catalog.types'
import { useCheckout } from '@/features/checkout/hooks/useCheckout'
import { TestimonialsSection } from '@/features/testimonials/sections/TestimonialsSection'

export function HomePage() {
  const navigate = useNavigate()
  const { data: book, isLoading } = useBook()
  const { setSelectedProduct } = useCheckout()

  const handleSelectProduct = (product: ProductVariant) => {
    setSelectedProduct(product)
    navigate(ROUTES.checkout)
  }

  if (isLoading || !book) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Seo
        title={`${book.title} | Landing page oficial`}
        description={book.description}
      />
      <HeroSection book={book} />
      <SynopsisSection book={book} />
      <AuthorSection author={book.author} />
      <WorldSection characters={book.characters} locations={book.locations} />
      <TestimonialsSection testimonials={book.testimonials} />
      <PurchaseOptionsSection products={book.variants} onSelect={handleSelectProduct} />
      <FAQSection items={book.faqs} />
    </>
  )
}
