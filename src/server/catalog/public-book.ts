import type { Book, ChapterPreview } from '@/features/catalog/types/catalog.types'
import { bookMock } from '@/mocks/book'
import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'

function toNumber(value: unknown) {
  return Number(value ?? 0)
}

function normalizeChapterIcon(icon?: string | null): ChapterPreview['icon'] {
  if (icon === 'eye' || icon === 'music' || icon === 'sparkles') {
    return icon
  }

  return 'sparkles'
}

function mapBookToPublicShape(book: {
  id: string
  slug: string
  title: string
  subtitle: string | null
  tagline: string | null
  description: string
  synopsis: string | null
  pitch: string | null
  isbn: string | null
  pageCount: number | null
  language: string | null
  publicationYear: number | null
  author: {
    id: string
    name: string
    headline: string | null
    bio: string | null
    photoUrl: string | null
    websiteUrl: string | null
    instagramUrl: string | null
    tiktokUrl: string | null
  } | null
  categories: Array<{
    category: {
      name: string
    }
  }>
  characters: Array<{
    id: string
    name: string
    role: string | null
    description: string
    imageUrl: string | null
    gridSpan: string | null
  }>
  locations: Array<{
    id: string
    name: string
    description: string
    imageUrl: string | null
    gridSpan: string | null
  }>
  chapters: Array<{
    id: string
    title: string
    description: string
    icon: string | null
  }>
  testimonials: Array<{
    id: string
    authorName: string
    text: string
    highlight: string | null
  }>
  faqItems: Array<{
    id: string
    question: string
    answer: string
  }>
  variants: Array<{
    id: string
    type: string
    name: string
    description: string
    priceAmount: unknown
    compareAtAmount: unknown
    shippingRequired: boolean
    autographAvailable: boolean
    giftsIncluded: string[]
    deliveryEstimate: string | null
  }>
}): Book {
  const socialLinks = [
    book.author?.instagramUrl
      ? { label: 'Instagram', url: book.author.instagramUrl }
      : null,
    book.author?.websiteUrl
      ? { label: 'Site oficial', url: book.author.websiteUrl }
      : null,
    book.author?.tiktokUrl
      ? { label: 'TikTok', url: book.author.tiktokUrl }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item))

  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    subtitle: book.subtitle ?? '',
    tagline: book.tagline ?? '',
    description: book.description,
    synopsis: book.synopsis ?? '',
    pitch: book.pitch ?? '',
    isbn: book.isbn ?? '',
    pageCount: book.pageCount ?? 0,
    language: book.language ?? 'Portugues',
    publicationYear: book.publicationYear ?? new Date().getFullYear(),
    categories: book.categories.map((item) => item.category.name),
    author: {
      id: book.author?.id ?? 'author-fallback',
      name: book.author?.name ?? 'Autora',
      headline: book.author?.headline ?? '',
      bio: book.author?.bio ?? '',
      photoUrl: book.author?.photoUrl ?? undefined,
      socialLinks,
    },
    characters: book.characters.map((character) => ({
      id: character.id,
      name: character.name,
      role: character.role ?? '',
      description: character.description,
      imageUrl: character.imageUrl ?? undefined,
      gridSpan: character.gridSpan ?? undefined,
    })),
    locations: book.locations.map((location) => ({
      id: location.id,
      name: location.name,
      description: location.description,
      imageUrl: location.imageUrl ?? undefined,
      gridSpan: location.gridSpan ?? undefined,
    })),
    chapters: book.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      description: chapter.description,
      icon: normalizeChapterIcon(chapter.icon),
    })),
    testimonials: book.testimonials.map((testimonial) => ({
      id: testimonial.id,
      authorName: testimonial.authorName,
      text: testimonial.text,
      highlight: testimonial.highlight ?? undefined,
    })),
    faqs: book.faqItems.map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
    })),
    variants: book.variants.map((variant) => ({
      id: variant.id,
      type: variant.type as Book['variants'][number]['type'],
      name: variant.name,
      description: variant.description,
      price: toNumber(variant.priceAmount),
      compareAtPrice: variant.compareAtAmount ? toNumber(variant.compareAtAmount) : undefined,
      shippingRequired: variant.shippingRequired,
      autographAvailable: variant.autographAvailable,
      giftsIncluded: variant.giftsIncluded,
      deliveryEstimate: variant.deliveryEstimate ?? '',
    })),
  }
}

export async function getPublicBookBySlug(slug: string) {
  if (!hasDatabaseUrl()) {
    return slug === bookMock.slug ? bookMock : null
  }

  try {
    const prisma = getPrismaClient()
    const book = await prisma.book.findUnique({
      where: { slug },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        chapters: {
          orderBy: {
            position: 'asc',
          },
        },
        characters: {
          orderBy: {
            position: 'asc',
          },
        },
        faqItems: {
          orderBy: {
            position: 'asc',
          },
        },
        locations: {
          orderBy: {
            position: 'asc',
          },
        },
        testimonials: {
          orderBy: {
            position: 'asc',
          },
        },
        variants: {
          where: {
            isActive: true,
          },
          orderBy: [
            {
              sortOrder: 'asc',
            },
            {
              createdAt: 'asc',
            },
          ],
        },
      },
    })

    if (!book) {
      return slug === bookMock.slug ? bookMock : null
    }

    return mapBookToPublicShape(book)
  } catch {
    return slug === bookMock.slug ? bookMock : null
  }
}
