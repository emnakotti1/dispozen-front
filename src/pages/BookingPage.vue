<template>
  <!-- Arrière-plan -->
  <div class="fixed inset-0 -z-10">
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${arriere})` }"
    ></div>
  </div>

  <!-- Contenu principal -->
  <div class="relative z-10 flex justify-center px-4 sm:px-6 lg:px-8 py-10">
    <div
      class="w-full max-w-4xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-8"
    >
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ t('booking.title') }}
        </h1>
        <p class="mt-2 text-gray-600">
          {{ t('booking.subtitle') }}
        </p>
      </div>

      <!-- Message de succès -->
      <div
        v-if="isSuccess"
        class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
      >
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            ></path>
          </svg>
          {{ t('booking.success') }}
        </div>
      </div>

      <!-- Message d'erreur -->
      <div
        v-if="isError"
        class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
      >
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <div>
            <div>{{ t('booking.error') }}</div>
            <div v-if="error" class="text-sm mt-1 opacity-90">
              {{ error?.message || error }}
            </div>
          </div>
        </div>
      </div>

      <!-- Informations du service -->
      <div
        v-if="selectedService"
        class="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200"
      >
        <h2 class="text-xl font-semibold text-blue-900 mb-2">
          {{ t('booking.serviceInfo.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-blue-700 font-medium">
              {{ t('booking.serviceInfo.serviceName') }}:
            </p>
            <p class="text-blue-900">{{ selectedService.name }}</p>
          </div>
          <div>
            <p class="text-sm text-blue-700 font-medium">
              {{ t('booking.serviceInfo.price') }}:
            </p>
            <p class="text-blue-900">
              {{ selectedService.price }} {{ selectedService.currency }}
            </p>
          </div>
          <div>
            <p class="text-sm text-blue-700 font-medium">
              {{ t('booking.serviceInfo.provider') }}:
            </p>
            <p class="text-blue-900">{{ providerName }}</p>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-sm text-blue-700 font-medium">
            {{ t('booking.serviceInfo.description') }}:
          </p>
          <p class="text-blue-900">{{ selectedService.description }}</p>
        </div>
      </div>

      <!-- Formulaire de réservation -->
      <form @submit.prevent="submitBooking" class="space-y-6">
        <!-- Sélection de la date -->
        <div>
          <label
            for="date"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            {{ t('booking.form.date') }} *
          </label>
          <input
            id="date"
            v-model="bookingForm.date"
            type="date"
            :min="minDate"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <!-- Sélection de l'heure -->
        <div>
          <label
            for="time"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            {{ t('booking.form.time') }} *
          </label>

          <!-- Indicateur de chargement des créneaux -->
          <div
            v-if="isLoadingUnavailabilities && bookingForm.date"
            class="flex items-center justify-center py-4"
          >
            <svg
              class="animate-spin h-5 w-5 text-indigo-600 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span class="text-sm text-gray-600"
              >Vérification des disponibilités...</span
            >
          </div>

          <!-- Grille des créneaux -->
          <div v-else class="grid grid-cols-4 gap-2">
            <button
              v-for="slot in allTimeSlots"
              :key="slot"
              type="button"
              :disabled="isSlotUnavailable(slot)"
              @click="!isSlotUnavailable(slot) && selectTimeSlot(slot)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md border transition-colors',
                isSlotUnavailable(slot)
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                  : bookingForm.startTime === slot
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer',
              ]"
              :title="isSlotUnavailable(slot) ? 'Créneau indisponible' : ''"
            >
              {{ slot }}
            </button>
          </div>

          <!-- Légende -->
          <div
            v-if="bookingForm.date && allTimeSlots.length > 0"
            class="mt-3 flex items-center space-x-4 text-xs text-gray-600"
          >
            <div class="flex items-center">
              <div
                class="w-3 h-3 bg-white border border-gray-300 rounded mr-1"
              ></div>
              <span>Disponible</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-indigo-600 rounded mr-1"></div>
              <span>Sélectionné</span>
            </div>
            <div class="flex items-center">
              <div
                class="w-3 h-3 bg-gray-100 border border-gray-200 rounded mr-1 opacity-50"
              ></div>
              <span>Indisponible</span>
            </div>
          </div>

          <p
            v-if="
              !isLoadingUnavailabilities &&
              availableTimeSlots.length === 0 &&
              bookingForm.date
            "
            class="mt-2 text-sm text-gray-500"
          >
            {{ t('booking.form.noSlotsAvailable') }}
          </p>
        </div>

        <!-- Notes additionnelles (optionnel) -->
        <div>
          <label
            for="notes"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            {{ t('booking.form.notes') }}
          </label>
          <textarea
            id="notes"
            v-model="bookingForm.notes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            :placeholder="t('booking.form.notesPlaceholder')"
          ></textarea>
        </div>

        <!-- Boutons -->
        <div class="flex flex-col sm:flex-row gap-3 pt-6">
          <button
            type="button"
            @click="$router.go(-1)"
            class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {{ t('booking.form.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ t('booking.form.submitting') }}
            </span>
            <span v-else>
              {{ t('booking.form.confirm') }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProviderServicesQuery } from '../hooksQuerie/useProviderServicesQuery'
import { useCreateAppointment } from '../hooksQuerie/appointments'
import { useProviderUnavailabilities } from '../hooksQuerie/calendar'
import arriere from '../assets/333.jpg'

const route = useRoute()
const { t } = useI18n()

// Récupération des paramètres de l'URL
const providerId = route.params.providerId as string
const serviceId = route.params.serviceId as string
const providerName = route.query.providerName as string

// Hooks pour les données
const { services } = useProviderServicesQuery(providerId)
const { createAppointment, resetErrors, isLoading, isError, isSuccess, error } =
  useCreateAppointment()

// Formulaire de réservation
const bookingForm = ref({
  date: '',
  startTime: '',
  notes: '',
})

// Service sélectionné
const selectedService = computed(() => {
  return services.value?.find(service => service.id === serviceId)
})

// Hook pour les indisponibilités - ne se déclenche que si une date est sélectionnée
const { data: unavailabilities, isLoading: isLoadingUnavailabilities } =
  useProviderUnavailabilities(
    providerId,
    computed(() => bookingForm.value.date),
  )

// Date minimum (aujourd'hui)
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Tous les créneaux horaires possibles (de 8h à 18h par exemple)
const allTimeSlots = computed(() => {
  if (!bookingForm.value.date) return []

  // Générer tous les créneaux possibles de 30 minutes entre 8h et 18h
  const slots = []
  for (let hour = 8; hour < 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    slots.push(`${hour.toString().padStart(2, '0')}:30`)
  }
  return slots
})

// Fonction pour vérifier si un créneau est indisponible
const isSlotUnavailable = (slot: string) => {
  if (!unavailabilities.value || !bookingForm.value.date) return false

  const selectedDate = bookingForm.value.date
  const unavailabilitiesForDate = unavailabilities.value.filter(
    unavailability => unavailability.date === selectedDate,
  )

  return unavailabilitiesForDate.some(unavailability => {
    const slotTime = slot
    const startTime = unavailability.startTime.substring(0, 5) // Format HH:MM
    const endTime = unavailability.endTime.substring(0, 5) // Format HH:MM

    // Vérifier si le créneau est dans la plage d'indisponibilité
    return slotTime >= startTime && slotTime < endTime
  })
}

// Créneaux horaires disponibles (pour la validation)
const availableTimeSlots = computed(() => {
  return allTimeSlots.value.filter(slot => !isSlotUnavailable(slot))
})

// Validation du formulaire
const isFormValid = computed(() => {
  return (
    bookingForm.value.date &&
    bookingForm.value.startTime &&
    selectedService.value &&
    !isSlotUnavailable(bookingForm.value.startTime) // Vérifier que le créneau sélectionné est disponible
  )
})

// Fonctions
const selectTimeSlot = (slot: string) => {
  // Vérifier que le créneau n'est pas indisponible avant de le sélectionner
  if (isSlotUnavailable(slot)) {
    console.warn("Tentative de sélection d'un créneau indisponible:", slot)
    return
  }
  bookingForm.value.startTime = slot
}

const submitBooking = () => {
  if (!isFormValid.value) return

  // Vérifier que l'utilisateur est connecté
  const userData = localStorage.getItem('userData')
  if (!userData) {
    console.error('User not authenticated')
    return
  }

  console.log('Submitting booking with data:', {
    providerId,
    serviceId,
    date: bookingForm.value.date,
    startTime: bookingForm.value.startTime,
    notes: bookingForm.value.notes,
  })

  createAppointment({
    providerId,
    serviceId,
    date: bookingForm.value.date,
    startTime: bookingForm.value.startTime,
    notes: bookingForm.value.notes || undefined, // Envoyer undefined si vide
  })
}

// Initialisation
onMounted(() => {
  // Réinitialiser les erreurs au montage du composant
  resetErrors()

  // Vérifier si les paramètres requis sont présents
  if (!providerId || !serviceId) {
    console.error('Provider ID and Service ID are required')
    // Rediriger vers la liste des providers
  }
})

// Watcher pour déselectionner un créneau qui devient indisponible
watch(
  () => bookingForm.value.date,
  () => {
    // Si un créneau est sélectionné et qu'il devient indisponible, le déselectionner
    if (
      bookingForm.value.startTime &&
      isSlotUnavailable(bookingForm.value.startTime)
    ) {
      console.log(
        'Créneau sélectionné devenu indisponible, désélection automatique',
      )
      bookingForm.value.startTime = ''
    }
  },
)
</script>
