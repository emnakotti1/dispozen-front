import { ref, computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  createService,
  getProviderServices,
  updateService,
  cancelService,
  toggleServiceStatus,
  type CreateServiceDto,
  type UpdateServiceDto,
  type ServiceStatus,
} from '../api/services.api'

// Hook pour récupérer les services d'un provider
export function useProviderServices(providerId: string) {
  const queryKey = computed(() => ['provider-services', providerId])

  const {
    data: services,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => {
      return getProviderServices(providerId)
    },
    enabled: computed(() => !!providerId),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true,
  })

  return {
    services,
    isLoading,
    isError,
    refetch,
  }
}

// Hook pour créer un service
export function useCreateService() {
  const queryClient = useQueryClient()
  const isSuccess = ref(false)
  const isSubmitting = ref(false)
  const hasError = ref(false)
  const errorMessage = ref<Error | null>(null)

  const mutation = useMutation({
    mutationFn: ({
      providerId,
      dto,
    }: {
      providerId: string
      dto: CreateServiceDto
    }) => createService(providerId, dto),
    onMutate: () => {
      isSubmitting.value = true
      hasError.value = false
      errorMessage.value = null
    },
    onSuccess: (_, { providerId }) => {
      // Invalider les requêtes liées aux services du provider
      queryClient.invalidateQueries({
        queryKey: ['provider-services', providerId],
      })
      isSuccess.value = true
      isSubmitting.value = false
      hasError.value = false
    },
    onError: error => {
      console.error('Error creating service:', error)
      isSuccess.value = false
      isSubmitting.value = false
      hasError.value = true
      errorMessage.value = error
    },
  })

  const createServiceMutation = (providerId: string, dto: CreateServiceDto) => {
    isSuccess.value = false // Réinitialiser avant de faire la requête
    mutation.mutate({ providerId, dto })
  }

  const resetErrors = () => {
    hasError.value = false
    errorMessage.value = null
    isSuccess.value = false
  }

  return {
    createService: createServiceMutation,
    resetErrors,
    isLoading: computed(() => isSubmitting.value),
    isError: computed(() => hasError.value),
    isSuccess: computed(() => isSuccess.value),
    error: computed(() => errorMessage.value),
    data: computed(() => mutation.data),
  }
}

// Hook pour mettre à jour un service
export function useUpdateService() {
  const queryClient = useQueryClient()
  const isSuccess = ref(false)
  const isSubmitting = ref(false)
  const hasError = ref(false)
  const errorMessage = ref<Error | null>(null)

  const mutation = useMutation({
    mutationFn: ({
      serviceId,
      dto,
    }: {
      serviceId: string
      dto: UpdateServiceDto
    }) => updateService(serviceId, dto),
    onMutate: () => {
      isSubmitting.value = true
      hasError.value = false
      errorMessage.value = null
    },
    onSuccess: () => {
      // Invalider les requêtes liées aux services
      queryClient.invalidateQueries({
        queryKey: ['provider-services'],
      })
      isSuccess.value = true
      isSubmitting.value = false
      hasError.value = false
    },
    onError: error => {
      console.error('Error updating service:', error)
      isSuccess.value = false
      isSubmitting.value = false
      hasError.value = true
      errorMessage.value = error
    },
  })

  const updateServiceMutation = (serviceId: string, dto: UpdateServiceDto) => {
    isSuccess.value = false
    mutation.mutate({ serviceId, dto })
  }

  const resetErrors = () => {
    hasError.value = false
    errorMessage.value = null
    isSuccess.value = false
  }

  return {
    updateService: updateServiceMutation,
    resetErrors,
    isLoading: computed(() => isSubmitting.value),
    isError: computed(() => hasError.value),
    isSuccess: computed(() => isSuccess.value),
    error: computed(() => errorMessage.value),
    data: computed(() => mutation.data),
  }
}

// Hook pour supprimer un service
export function useDeleteService() {
  const queryClient = useQueryClient()
  const successMessage = ref('')
  const showSuccess = ref(false)

  const mutation = useMutation({
    mutationFn: cancelService,
    onSuccess: async () => {
      // Invalider toutes les requêtes qui commencent par 'provider-services'
      await queryClient.invalidateQueries({
        predicate: query => {
          return (
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === 'provider-services'
          )
        },
      })

      successMessage.value = 'Service supprimé avec succès'
      showSuccess.value = true

      // Masquer le message après 3 secondes
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    },
    onError: error => {
      console.error('Error deleting service:', error)
    },
  })

  const cancelServiceMutation = (serviceId: string) => {
    mutation.mutate(serviceId)
  }

  return {
    cancelService: cancelServiceMutation,
    isLoading: computed(() => mutation.isPending),
    isError: computed(() => mutation.isError),
    error: computed(() => mutation.error),
    successMessage: computed(() => successMessage.value),
    showSuccess: computed(() => showSuccess.value),
  }
}

// Hook pour changer le statut d'un service
export function useToggleServiceStatus() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({
      serviceId,
      status,
    }: {
      serviceId: string
      status: ServiceStatus
    }) => toggleServiceStatus(serviceId, status),
    onSuccess: async () => {
      // Invalider toutes les requêtes qui commencent par 'provider-services'
      await queryClient.invalidateQueries({
        predicate: query => {
          return (
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === 'provider-services'
          )
        },
      })
    },
    onError: error => {
      console.error('Error updating service status:', error)
    },
  })

  const toggleStatus = (serviceId: string, status: ServiceStatus) => {
    mutation.mutate({ serviceId, status })
  }

  return {
    toggleStatus,
    isLoading: computed(() => mutation.isPending),
    isError: computed(() => mutation.isError),
    error: computed(() => mutation.error),
  }
}
