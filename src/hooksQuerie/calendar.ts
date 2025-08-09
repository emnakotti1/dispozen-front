import { useQuery } from '@tanstack/vue-query'
import { getProviderUnavailabilities } from '../api/calendar.api'
import { computed, type ComputedRef } from 'vue'

export function useProviderUnavailabilities(
  providerId: string,
  selectedDate: ComputedRef<string>,
) {
  return useQuery({
    queryKey: computed(() => [
      'provider-unavailabilities',
      providerId,
      selectedDate.value,
    ]),
    queryFn: () => {
      console.log(
        '🔍 Fetching unavailabilities for provider:',
        providerId,
        'on date:',
        selectedDate.value,
      )
      return getProviderUnavailabilities(providerId)
    },
    enabled: computed(() => {
      const shouldFetch = !!providerId && !!selectedDate.value
      if (shouldFetch) {
        console.log('✅ Fetching enabled for date:', selectedDate.value)
      } else {
        console.log(
          '❌ Fetching disabled - providerId:',
          providerId,
          'selectedDate:',
          selectedDate.value,
        )
      }
      return shouldFetch
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
