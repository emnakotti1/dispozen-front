import { ref, computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  createAppointment,
  getAppointments,
  type CreateAppointmentDto,
} from '../api/appointments.api'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const isSuccess = ref(false)
  const { currentUser } = useAuth()

  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      // Invalider les requêtes liées aux rendez-vous pour le client connecté
      queryClient.invalidateQueries({
        queryKey: ['appointments', currentUser.value?.id],
      })
      isSuccess.value = true

      // Rediriger vers la liste des rendez-vous après 2 secondes
      setTimeout(() => {
        router.push('/appointments')
      }, 2000)
    },
    onError: error => {
      console.error('Error creating appointment:', error)
      isSuccess.value = false // Réinitialiser le succès en cas d'erreur
    },
  })

  const createAppointmentMutation = (dto: CreateAppointmentDto) => {
    isSuccess.value = false // Réinitialiser avant de faire la requête
    mutation.mutate(dto)
  }

  return {
    createAppointment: createAppointmentMutation,
    isLoading: computed(() => mutation.isPending),
    isError: computed(() => mutation.isError),
    isSuccess: computed(() => isSuccess.value),
    error: computed(() => mutation.error),
    data: computed(() => mutation.data),
  }
}

export function useAppointments() {
  const { currentUser } = useAuth()

  const {
    data: appointments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['appointments', currentUser.value?.id],
    queryFn: () => getAppointments(currentUser.value!.id),
    enabled: !!currentUser.value?.id,
  })

  return {
    appointments,
    isLoading,
    isError,
  }
}
