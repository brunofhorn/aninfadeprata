import type { ProductType } from '@/types/enums'

export interface SocialLink {
  label: string
  url: string
}

export interface ChapterPreview {
  id: string
  title: string
  description: string
  icon: 'sparkles' | 'eye' | 'music'
}

export interface Author {
  id: string
  name: string
  headline: string
  bio: string
  photoUrl?: string
  socialLinks: SocialLink[]
}

export interface Character {
  id: string
  name: string
  role: string
  description: string
  imageUrl?: string
  gridSpan?: string
}

export interface Location {
  id: string
  name: string
  description: string
  imageUrl?: string
  gridSpan?: string
}

export interface Testimonial {
  id: string
  authorName: string
  text: string
  highlight?: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface ProductVariant {
  id: string
  type: ProductType
  name: string
  description: string
  price: number
  compareAtPrice?: number
  shippingRequired: boolean
  autographAvailable: boolean
  giftsIncluded?: string[]
  deliveryEstimate: string
}

export interface Book {
  id: string
  slug: string
  title: string
  subtitle: string
  tagline: string
  description: string
  synopsis: string
  pitch: string
  isbn: string
  pageCount: number
  language: string
  publicationYear: number
  categories: string[]
  author: Author
  characters: Character[]
  locations: Location[]
  chapters: ChapterPreview[]
  testimonials: Testimonial[]
  faqs: FaqItem[]
  variants: ProductVariant[]
}
