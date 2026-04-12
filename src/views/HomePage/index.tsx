'use client'

import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Seo } from '@/components/common/Seo'
import { ROUTES } from '@/constants/routes'
import { AuthorSection } from '@/features/author/sections/AuthorSection'
import { useBook } from '@/features/catalog/hooks/useBook'
import { ChaptersSection } from '@/features/catalog/sections/ChaptersSection'
import { ContactSection } from '@/features/catalog/sections/ContactSection'
import { FAQSection } from '@/features/catalog/sections/FAQSection'
import { HeroSection } from '@/features/catalog/sections/HeroSection'
import { PurchaseOptionsSection } from '@/features/catalog/sections/PurchaseOptionsSection'
import { SynopsisSection } from '@/features/catalog/sections/SynopsisSection'
import { WorldSection } from '@/features/catalog/sections/WorldSection'
import type { ProductVariant } from '@/features/catalog/types/catalog.types'
import { useCheckout } from '@/features/checkout/hooks/useCheckout'

export function HomePage() {
  const router = useRouter()
  const { data: book, isLoading } = useBook()
  const { setSelectedProduct } = useCheckout()

  const handleSelectProduct = (product: ProductVariant) => {
    setSelectedProduct(product)
    router.push(ROUTES.checkout)
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
      <div className="bg-forest-950 text-white">
        <HeroSection book={book} />
        <SynopsisSection book={book} />
        <WorldSection characters={book.characters} locations={book.locations} />
        <ChaptersSection chapters={book.chapters} />
        <PurchaseOptionsSection products={book.variants} onSelect={handleSelectProduct} />
        <AuthorSection author={book.author} />
        <FAQSection items={book.faqs} />
        <ContactSection />
      </div>
    </>
  )
}
