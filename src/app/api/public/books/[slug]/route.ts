import { NextResponse } from 'next/server'
import { getPublicBookBySlug } from '@/server/catalog/public-book'

export const runtime = 'nodejs'

interface RouteContext {
  params: Promise<{
    slug: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params
  const book = await getPublicBookBySlug(slug)

  if (!book) {
    return NextResponse.json({ message: 'Livro nao encontrado.' }, { status: 404 })
  }

  return NextResponse.json(book)
}
