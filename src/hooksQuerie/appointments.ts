import { ref, computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  createAppointment,
  cancelAppointment,
  confirmAppointment,
  getAppointments,
  getProviderAppointments,
  type CreateAppointmentDto,
} from '../api/appointments.api'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const isSuccess = ref(false)
  const isSubmitting = ref(false)
  const hasError = ref(false)
  const errorMessage = ref<Error | null>(null)
  const { currentUser } = useAuth()

  const mutation = useMutation({
    mutationFn: createAppointment,
    onMutate: () => {
      isSubmitting.value = true
      hasError.value = false
      errorMessage.value = null
    },
    onSuccess: () => {
      // Invalider les requêtes liées aux rendez-vous pour le client connecté
      queryClient.invalidateQueries({
        queryKey: ['appointments', currentUser.value?.id],
      })
      isSuccess.value = true
      isSubmitting.value = false
      hasError.value = false

      // Rediriger vers la liste des rendez-vous après 2 secondes
      setTimeout(() => {
        router.push('/appointments')
      }, 2000)
    },
    onError: error => {
      console.error('Error creating appointment:', error)
      isSuccess.value = false
      isSubmitting.value = false
      hasError.value = true
      errorMessage.value = error
    },
  })

  const createAppointmentMutation = (dto: CreateAppointmentDto) => {
    isSuccess.value = false // Réinitialiser avant de faire la requête
    mutation.mutate(dto)
  }

  const resetErrors = () => {
    hasError.value = false
    errorMessage.value = null
    isSuccess.value = false
  }

  return {
    createAppointment: createAppointmentMutation,
    resetErrors,
    isLoading: computed(() => isSubmitting.value),
    isError: computed(() => hasError.value),
    isSuccess: computed(() => isSuccess.value),
    error: computed(() => errorMessage.value),
    data: computed(() => mutation.data),
  }
}

export function useAppointments() {
  const { currentUser } = useAuth()

  const queryKey = computed(() => ['appointments', currentUser.value?.id])

  const {
    data: appointments,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => {
      console.log('Fetching appointments for user:', currentUser.value?.id)
      return getAppointments(currentUser.value!.id)
    },
    enabled: computed(() => !!currentUser.value?.id),
    staleTime: 0, // Consider data stale immediately
    refetchOnWindowFocus: true, // Refetch when window gains focus
  })

  return {
    appointments,
    isLoading,
    isError,
    refetch,
  }
}

export function useCancelAppointment() {
  const queryClient = useQueryClient()
  const { currentUser } = useAuth()
  const successMessage = ref('')
  const showSuccess = ref(false)

  const mutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: async (_, appointmentId) => {
      console.log(
        'Appointment cancelled successfully, updating cache for user:',
        currentUser.value?.id,
      )

      const queryKey = ['appointments', currentUser.value?.id]

      // Mettre à jour directement les données dans le cache
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData

        return oldData.map((appointment: any) =>
          appointment.id === appointmentId
            ? { ...appointment, status: 'cancelled' }
            : appointment,
        )
      })

      // Invalider les requêtes pour s'assurer que les données sont fraîches
      await queryClient.invalidateQueries({
        queryKey,
      })

      console.log('Cache updated and queries invalidated')

      // Afficher un message de succès
      successMessage.value = 'Rendez-vous annulé avec succès'
      showSuccess.value = true

      // Masquer le message après 3 secondes
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    },
    onError: error => {
      console.error('Error cancelling appointment:', error)
    },
  })

  const cancelAppointmentMutation = (appointmentId: string) => {
    console.log('Cancelling appointment:', appointmentId)
    mutation.mutate(appointmentId)
  }

  return {
    cancelAppointment: cancelAppointmentMutation,
    isLoading: computed(() => mutation.isPending),
    isError: computed(() => mutation.isError),
    error: computed(() => mutation.error),
    successMessage: computed(() => successMessage.value),
    showSuccess: computed(() => showSuccess.value),
  }
}

export function useProviderAppointments(providerId: string) {
  const queryKey = computed(() => ['provider-appointments', providerId])

  const {
    data: appointments,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => {
      console.log('Fetching appointments for provider:', providerId)
      return getProviderAppointments(providerId)
    },
    enabled: computed(() => !!providerId),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window gains focus
  })

  return {
    appointments,
    isLoading,
    isError,
    refetch,
  }
}

export function useConfirmAppointment() {
  const queryClient = useQueryClient()
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const isError = ref(false)
  const errorMessage = ref<string | null>(null)

  const mutation = useMutation({
    mutationFn: confirmAppointment,
    onMutate: () => {
      isLoading.value = true
      isSuccess.value = false
      isError.value = false
      errorMessage.value = null
    },
    onSuccess: () => {
      isLoading.value = false
      isSuccess.value = true
      isError.value = false

      // Invalider les requêtes liées aux rendez-vous pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: ['provider-appointments'],
      })
      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      })
    },
    onError: (error: any) => {
      console.error('Error confirming appointment:', error)
      isLoading.value = false
      isSuccess.value = false
      isError.value = true
      errorMessage.value =
        error.message || 'Erreur lors de la confirmation du rendez-vous'
    },
  })

  const confirmAppointmentFn = async (appointmentId: string) => {
    console.log('🔄 Hook: Début confirmation appointment:', appointmentId)
    try {
      const result = await mutation.mutateAsync(appointmentId)
      console.log('✅ Hook: Confirmation réussie:', result)
      return result
    } catch (error) {
      console.error('❌ Hook: Erreur confirmation:', error)
      throw error
    }
  }

  return {
    confirmAppointment: confirmAppointmentFn,
    isLoading: computed(() => isLoading.value),
    isSuccess: computed(() => isSuccess.value),
    isError: computed(() => isError.value),
    errorMessage: computed(() => errorMessage.value),
  }
}
