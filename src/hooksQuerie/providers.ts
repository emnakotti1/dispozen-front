import { useQuery } from '@tanstack/vue-query'
import { getProviders } from '../api/providers.api'

export function useProvidersQuery() {
  return useQuery({
    queryKey: ['providers'],
    queryFn: getProviders,
  })
}
