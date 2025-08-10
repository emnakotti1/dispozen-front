<template>
  <div class="space-y-6">
    <!-- Today's Date Header -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ todayFormatted }}</h2>
          <p class="text-sm text-gray-600">
            {{ todayAppointments.length }} rendez-vous aujourd'hui
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
          >
            Aujourd'hui
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="appointmentsLoading" class="bg-white shadow rounded-lg p-6">
      <div class="text-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"
        ></div>
        <p class="mt-2 text-sm text-gray-500">Chargement des rendez-vous...</p>
      </div>
    </div>

    <!-- No Appointments Today -->
    <div
      v-else-if="todayAppointments.length === 0"
      class="bg-white shadow rounded-lg p-6"
    >
      <div class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
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
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          Aucun rendez-vous aujourd'hui
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          Profitez de cette journée libre !
        </p>
      </div>
    </div>

    <!-- Today's Appointments -->
    <div v-else class="space-y-4">
      <div
        v-for="appointment in todayAppointments"
        :key="appointment.id"
        class="bg-white shadow rounded-lg p-6"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-4">
            <!-- Time -->
            <div class="flex-shrink-0">
              <div class="flex flex-col items-center">
                <span class="text-lg font-semibold text-gray-900">{{
                  appointment.calendar?.startTime
                }}</span>
                <span class="text-sm text-gray-500">{{
                  appointment.calendar?.endTime
                }}</span>
              </div>
            </div>

            <!-- Appointment Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center">
                <img
                  class="h-10 w-10 rounded-full"
                  :src="`https://ui-avatars.com/api/?name=${appointment.client.firstName}+${appointment.client.lastName}&background=6366f1&color=fff`"
                  :alt="`${appointment.client.firstName} ${appointment.client.lastName}`"
                />
                <div class="ml-3">
                  <p class="text-lg font-medium text-gray-900">
                    {{ appointment.client.firstName }}
                    {{ appointment.client.lastName }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ appointment.client.email }}
                  </p>
                </div>
              </div>

              <div class="mt-4">
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6"
                    ></path>
                  </svg>
                  <span class="text-sm font-medium text-gray-900">{{
                    appointment.service.name
                  }}</span>
                </div>
                <div class="flex items-center mt-1">
                  <svg
                    class="w-4 h-4 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span class="text-sm text-gray-500"
                    >Durée: {{ appointment.service.duration }} minutes</span
                  >
                </div>
                <div v-if="appointment.notes" class="flex items-start mt-2">
                  <svg
                    class="w-4 h-4 text-gray-400 mr-2 mt-0.5"
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
                  <span class="text-sm text-gray-500">{{
                    appointment.notes
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Status and Actions -->
          <div class="flex flex-col items-end space-y-3">
            <!-- Status Badge -->
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                appointment.status === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : appointment.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : appointment.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800',
              ]"
            >
              {{
                appointment.status === 'confirmed'
                  ? 'Confirmé'
                  : appointment.status === 'pending'
                  ? 'En attente'
                  : appointment.status === 'cancelled'
                  ? 'Annulé'
                  : appointment.status
              }}
            </span>

            <!-- Actions -->
            <div v-if="appointment.status === 'pending'" class="flex space-x-2">
              <button
                @click="confirmAppointment(appointment.id)"
                :disabled="confirmLoading"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                <svg
                  v-if="confirmLoading"
                  class="animate-spin -ml-1 mr-1 h-3 w-3 text-white"
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
                Confirmer
              </button>
              <button
                @click="cancelAppointment(appointment.id)"
                :disabled="cancelLoading"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <svg
                  v-if="cancelLoading"
                  class="animate-spin -ml-1 mr-1 h-3 w-3 text-gray-700"
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
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Navigation -->
    <div class="bg-white shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Navigation rapide</h3>
      <div class="flex space-x-4">
        <router-link
          to="/provider/calendar"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg
            class="w-4 h-4 mr-2"
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
          Voir le calendrier complet
        </router-link>
        <router-link
          to="/provider/appointments"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg
            class="w-4 h-4 mr-2"
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
          Gérer les réservations
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../../composables/useAuth'
import {
  useProviderAppointments,
  useConfirmAppointment,
  useCancelAppointment,
} from '../../hooksQuerie/appointments'

const { currentUser } = useAuth()
const providerId = computed(() => currentUser.value?.id || '')

// Get appointments data
const { appointments, isLoading: appointmentsLoading } =
  useProviderAppointments(providerId.value)

// Appointment actions
const { confirmAppointment: confirmMutation, isLoading: confirmLoadingRef } =
  useConfirmAppointment()
const { cancelAppointment: cancelMutation, isLoading: cancelLoadingRef } =
  useCancelAppointment()

// Local computed for better typing
const confirmLoading = computed(() => !!confirmLoadingRef.value)
const cancelLoading = computed(() => !!cancelLoadingRef.value)

// Today's date
const today = new Date()
const todayString = today.toISOString().split('T')[0]

const todayFormatted = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(today)
})

// Filter today's appointments
const todayAppointments = computed(() => {
  if (!appointments.value) return []

  return appointments.value
    .filter(appointment => {
      const appointmentDate = appointment.calendar?.date
      return appointmentDate === todayString
    })
    .sort((a, b) => {
      // Sort by start time
      const timeA = a.calendar?.startTime || ''
      const timeB = b.calendar?.startTime || ''
      return timeA.localeCompare(timeB)
    })
})

const confirmAppointment = (appointmentId: string) => {
  confirmMutation(appointmentId)
}

const cancelAppointment = (appointmentId: string) => {
  if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
    cancelMutation(appointmentId)
  }
}
</script>
