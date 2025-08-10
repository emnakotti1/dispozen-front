import { ref, computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  getProviderWorkingHours,
  getMyWorkingHours,
  updateMyWorkingHours,
  type UpdateWorkingHoursDto,
  type DayOfWeek,
} from '../api/workingHours.api'

// Hook pour récupérer les horaires de travail d'un provider spécifique
export function useProviderWorkingHours(providerId: string) {
  const queryKey = computed(() => ['working-hours', 'provider', providerId])

  const {
    data: workingHours,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => {
      console.log('Fetching working hours for provider:', providerId)
      return getProviderWorkingHours(providerId)
    },
    enabled: computed(() => !!providerId),
    staleTime: 1000 * 60 * 10, // Consider data fresh for 10 minutes
    refetchOnWindowFocus: true,
  })

  return {
    workingHours,
    isLoading,
    isError,
    refetch,
  }
}

// Hook pour récupérer mes propres horaires de travail (provider connecté)
export function useMyWorkingHours() {
  const queryKey = ['working-hours', 'me']

  const {
    data: workingHours,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => {
      console.log('Fetching my working hours')
      return getMyWorkingHours()
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true,
  })

  return {
    workingHours,
    isLoading,
    isError,
    refetch,
  }
}

// Hook pour mettre à jour mes horaires de travail
export function useUpdateMyWorkingHours() {
  const queryClient = useQueryClient()
  const isSuccess = ref(false)
  const isSubmitting = ref(false)
  const hasError = ref(false)
  const errorMessage = ref<Error | null>(null)

  const mutation = useMutation({
    mutationFn: updateMyWorkingHours,
    onMutate: () => {
      isSubmitting.value = true
      hasError.value = false
      errorMessage.value = null
    },
    onSuccess: data => {
      // Invalider les requêtes liées aux horaires de travail
      queryClient.invalidateQueries({
        queryKey: ['working-hours'],
      })

      // Mettre à jour directement le cache pour mes horaires
      queryClient.setQueryData(['working-hours', 'me'], data)

      isSuccess.value = true
      isSubmitting.value = false
      hasError.value = false
      console.log('Working hours updated successfully:', data)
    },
    onError: error => {
      console.error('Error updating working hours:', error)
      isSuccess.value = false
      isSubmitting.value = false
      hasError.value = true
      errorMessage.value = error
    },
  })

  const updateWorkingHours = (workingHours: UpdateWorkingHoursDto[]) => {
    isSuccess.value = false // Réinitialiser avant de faire la requête
    mutation.mutate(workingHours)
  }

  const resetErrors = () => {
    hasError.value = false
    errorMessage.value = null
    isSuccess.value = false
  }

  return {
    updateWorkingHours,
    resetErrors,
    isLoading: computed(() => isSubmitting.value),
    isError: computed(() => hasError.value),
    isSuccess: computed(() => isSuccess.value),
    error: computed(() => errorMessage.value),
    data: computed(() => mutation.data),
  }
}

// Helper function pour créer un ensemble d'horaires par défaut
export function createDefaultWorkingHours(): UpdateWorkingHoursDto[] {
  const days: DayOfWeek[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]

  return days.map(day => ({
    dayOfWeek: day,
    startTime: day === 'saturday' || day === 'sunday' ? null : '09:00',
    endTime: day === 'saturday' || day === 'sunday' ? null : '17:00',
    isClosed: day === 'saturday' || day === 'sunday',
  }))
}

// Helper function pour obtenir le label français du jour
export function getDayLabel(day: DayOfWeek): string {
  const labels: Record<DayOfWeek, string> = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
  }
  return labels[day]
}
