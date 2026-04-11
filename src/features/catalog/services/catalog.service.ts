import { bookMock } from '@/mocks/book'
import type { Book } from '@/features/catalog/types/catalog.types'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const catalogService = {
  async getFeaturedBook(): Promise<Book> {
    await sleep(250)
    return bookMock
  },
}
