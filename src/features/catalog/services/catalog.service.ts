import type { Book } from '@/features/catalog/types/catalog.types'
import { API_ENDPOINTS } from '@/integrations/api/endpoints'
import { api } from '@/integrations/api/axios'

export const catalogService = {
  async getFeaturedBook(): Promise<Book> {
    const response = await api.get<Book>(API_ENDPOINTS.bookBySlug('a-ninfa-de-prata'))
    return response.data
  },
}
