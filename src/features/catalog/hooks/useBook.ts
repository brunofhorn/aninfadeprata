import { useQuery } from '@tanstack/react-query'
import { catalogService } from '@/features/catalog/services/catalog.service'

export function useBook() {
  return useQuery({
    queryKey: ['featured-book'],
    queryFn: catalogService.getFeaturedBook,
  })
}
