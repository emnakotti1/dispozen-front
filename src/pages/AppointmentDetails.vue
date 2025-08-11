<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Error State -->
    <div v-if="isError" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <svg
          class="w-12 h-12 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          ></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Erreur de chargement
      </h3>
      <p class="text-gray-600 mb-4">
        Impossible de charger les détails de la réservation.
      </p>
      <button
        @click="router.go(-1)"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Retour
      </button>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Chargement des détails...</p>
    </div>

    <!-- Appointment Details -->
    <div
      v-else-if="appointment"
      class="bg-white shadow-lg rounded-lg overflow-hidden"
    >
      <!-- Header -->
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 text-white"
      >
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">Détails de la réservation</h1>
            <p class="mt-1 text-indigo-100">#{{ appointment.id }}</p>
          </div>
          <div class="text-right">
            <span :class="getStatusClass(appointment.status)">
              {{ getStatusLabel(appointment.status) }}
            </span>
          </div>
        </div>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Service Information -->
          <div class="space-y-6">
            <div>
              <h2
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
              >
                <svg
                  class="w-5 h-5 mr-2 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
                Service
              </h2>
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-medium text-gray-900 text-lg">
                  {{ appointment.service.name }}
                </h3>
                <p
                  v-if="appointment.service.description"
                  class="text-gray-600 mt-2"
                >
                  {{ appointment.service.description }}
                </p>
                <div class="mt-3 flex items-center justify-between">
                  <span class="text-sm text-gray-500"
                    >Durée: {{ appointment.service.duration }} minutes</span
                  >
                  <span class="text-lg font-semibold text-indigo-600"
                    >{{ appointment.service.price
                    }}{{ appointment.service.currency }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Provider Information (for clients) or Client Information (for providers) -->
            <div>
              <h2
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
              >
                <svg
                  class="w-5 h-5 mr-2 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                {{
                  currentUser?.role === 'provider' ? 'Client' : 'Prestataire'
                }}
              </h2>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center">
                  <div
                    class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center"
                  >
                    <span class="text-indigo-600 font-medium text-lg">
                      {{
                        getInitials(
                          currentUser?.role === 'provider'
                            ? appointment.client
                            : appointment.provider,
                        )
                      }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <h3 class="font-medium text-gray-900">
                      {{
                        currentUser?.role === 'provider'
                          ? appointment.client.firstName
                          : appointment.provider.firstName
                      }}
                      {{
                        currentUser?.role === 'provider'
                          ? appointment.client.lastName
                          : appointment.provider.lastName
                      }}
                    </h3>
                    <p class="text-gray-600">
                      {{
                        currentUser?.role === 'provider'
                          ? appointment.client.email
                          : appointment.provider.email
                      }}
                    </p>
                    <p
                      v-if="
                        currentUser?.role === 'provider'
                          ? appointment.client.phoneNumber
                          : appointment.provider.phoneNumber
                      "
                      class="text-gray-600"
                    >
                      {{
                        currentUser?.role === 'provider'
                          ? appointment.client.phoneNumber
                          : appointment.provider.phoneNumber
                      }}
                    </p>
                  </div>
                </div>

                <!-- Additional information -->
                <div
                  v-if="
                    currentUser?.role === 'provider' &&
                    appointment.client.biography
                  "
                  class="mt-4 pt-4 border-t border-gray-200"
                >
                  <h4 class="font-medium text-gray-900 mb-2">À propos</h4>
                  <p class="text-gray-600 text-sm">
                    {{ appointment.client.biography }}
                  </p>
                </div>

                <div
                  v-if="
                    currentUser?.role === 'client' &&
                    appointment.provider.biography
                  "
                  class="mt-4 pt-4 border-t border-gray-200"
                >
                  <h4 class="font-medium text-gray-900 mb-2">À propos</h4>
                  <p class="text-gray-600 text-sm">
                    {{ appointment.provider.biography }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Appointment Information -->
          <div class="space-y-6">
            <!-- Date & Time -->
            <div>
              <h2
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
              >
                <svg
                  class="w-5 h-5 mr-2 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                Date et heure
              </h2>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span class="block text-sm font-medium text-gray-700 mb-1"
                      >Date</span
                    >
                    <p class="text-gray-900">
                      {{
                        appointment.calendar
                          ? formatDate(appointment.calendar.date)
                          : 'Date non définie'
                      }}
                    </p>
                  </div>
                  <div v-if="appointment.calendar">
                    <span class="block text-sm font-medium text-gray-700 mb-1"
                      >Heure</span
                    >
                    <p class="text-gray-900">
                      {{ appointment.calendar.startTime }} -
                      {{ appointment.calendar.endTime }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="appointment.notes">
              <h2
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
              >
                <svg
                  class="w-5 h-5 mr-2 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 8h10M7 12h4m1-8l-1-1a2 2 0 011.414-1.414L14 1l1 1-1 1-1.414-1.414A2 2 0 0111 2z"
                  ></path>
                </svg>
                Notes
              </h2>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-gray-900">{{ appointment.notes }}</p>
              </div>
            </div>

            <!-- Address Information (only for providers when viewed by clients) -->
            <div
              v-if="
                currentUser?.role === 'client' && appointment.provider.address
              "
            >
              <h2
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
              >
                <svg
                  class="w-5 h-5 mr-2 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                Adresse du prestataire
              </h2>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-gray-900">{{ appointment.provider.address }}</p>
                <p v-if="appointment.provider.city" class="text-gray-900 mt-1">
                  {{ appointment.provider.postalCode }}
                  {{ appointment.provider.city }}
                </p>
                <p
                  v-if="appointment.provider.governorate"
                  class="text-gray-600 text-sm mt-1"
                >
                  {{ appointment.provider.governorate }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row gap-3 justify-between">
            <button
              @click="router.go(-1)"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg
                class="w-4 h-4 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Retour
            </button>

            <div class="flex gap-3">
              <!-- Cancel button only for pending appointments -->
              <button
                v-if="appointment.status === 'pending' && canCancel"
                @click="handleCancelAppointment"
                :disabled="isCancelling"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                <span v-if="isCancelling">Annulation...</span>
                <span v-else>Annuler</span>
              </button>

              <!-- Confirm button only for providers and pending appointments -->
              <button
                v-if="appointment.status === 'pending' && canConfirm"
                @click="handleConfirmAppointment"
                :disabled="isConfirming"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                <span v-if="isConfirming">Confirmation...</span>
                <span v-else>Confirmer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg
          class="w-12 h-12 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          ></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Réservation introuvable
      </h3>
      <p class="text-gray-600 mb-4">
        Cette réservation n'existe pas ou a été supprimée.
      </p>
      <button
        @click="router.push('/appointments')"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Voir toutes les réservations
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useAppointmentDetails } from '../hooksQuerie/appointments'

// Get appointment ID from route
const route = useRoute()
const router = useRouter()
const { currentUser } = useAuth()

const appointmentId = computed(() => route.params.id as string)

// Récupérer les détails de la réservation via API
const { appointment, isLoading, isError } = useAppointmentDetails(
  appointmentId.value,
)

// Simple loading states for demo
const isCancelling = ref(false)
const isConfirming = ref(false)

// Permissions based on user role
const canCancel = computed(() => true) // Logic to determine if user can cancel
const canConfirm = computed(() => currentUser.value?.role === 'provider') // Only providers can confirm

const handleCancelAppointment = async () => {
  if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
    isCancelling.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (appointment.value) {
        appointment.value.status = 'cancelled'
      }
      router.push('/appointments')
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error)
    } finally {
      isCancelling.value = false
    }
  }
}

const handleConfirmAppointment = async () => {
  isConfirming.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (appointment.value) {
      appointment.value.status = 'confirmed'
    }
  } catch (error) {
    console.error('Erreur lors de la confirmation:', error)
  } finally {
    isConfirming.value = false
  }
}

// Utility functions
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmé'
    case 'pending':
      return 'En attente'
    case 'cancelled':
      return 'Annulé'
    default:
      return status
  }
}

const getStatusClass = (status: string) => {
  const baseClass =
    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium'
  switch (status) {
    case 'confirmed':
      return `${baseClass} bg-green-100 text-green-800`
    case 'pending':
      return `${baseClass} bg-yellow-100 text-yellow-800`
    case 'cancelled':
      return `${baseClass} bg-red-100 text-red-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

const getInitials = (provider: any) => {
  return `${provider.firstName?.[0] || ''}${provider.lastName?.[0] || ''}`
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
