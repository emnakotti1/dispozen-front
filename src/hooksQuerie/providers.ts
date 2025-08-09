import { useInfiniteQuery } from '@tanstack/vue-query'
import { getProviders } from '../api/providers.api'
import type { Provider } from '../api/providers.api'
import type { QueryFunctionContext } from '@tanstack/vue-query'

export function useProvidersInfiniteQuery(limit = 6) {
  return useInfiniteQuery<Provider[], Error>({
    queryKey: ['providers'],
    queryFn: ({ pageParam = 1 }: QueryFunctionContext) =>
      getProviders(pageParam as number, limit),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < limit) return undefined
      return pages.length + 1
    },
    initialPageParam: 1,
  })
}
