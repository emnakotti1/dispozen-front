import { ref, onMounted } from 'vue'
import type { Service } from '../api/providerServiceApi'
import { getServicesByProvider } from '../api/providerServiceApi'

export function useProviderServicesQuery(providerId: string) {
  const services = ref<Service[]>([])
  const isLoading = ref(true)
  const isError = ref(false)

  onMounted(async () => {
    try {
      services.value = await getServicesByProvider(providerId)
    } catch (error) {
      isError.value = true
      console.error('Erreur lors du chargement des services :', error)
    } finally {
      isLoading.value = false
    }
  })

  return {
    services,
    isLoading,
    isError,
  }
}
