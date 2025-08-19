import { useQuery } from '@tanstack/vue-query'
import { ref, computed, type Ref } from 'vue'
import { getProviders } from '../api/providers.api'
import type { Provider } from '../api/providers.api'

export function useProvidersQuery(limit = 6, searchQuery?: Ref<string>) {
  const currentPage = ref(1)

  const query = useQuery<Provider[], Error>({
    queryKey: computed(() => [
      'providers',
      currentPage.value,
      searchQuery?.value,
    ]),
    queryFn: () => getProviders(currentPage.value, limit, searchQuery?.value),
  })

  function nextPage() {
    currentPage.value++
  }

  function prevPage() {
    if (currentPage.value > 1) currentPage.value--
  }

  // Reset to page 1 when search changes
  function resetPage() {
    currentPage.value = 1
  }

  return {
    ...query,
    currentPage,
    nextPage,
    prevPage,
    resetPage,
  }
}
