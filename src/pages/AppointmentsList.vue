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
      class="w-full max-w-6xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-8"
    >
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ t('appointments.title') }}
        </h1>
        <p class="mt-2 text-gray-600">
          {{ t('appointments.subtitle') }}
        </p>
      </div>

      <!-- Loading / Error -->
      <div v-if="isLoading" class="text-center text-gray-500">
        {{ t('common.loading') }}
      </div>
      <div v-else-if="isError" class="text-center text-red-500">
        {{ t('appointments.error') }}
      </div>

      <!-- Liste des rendez-vous -->
      <div v-else class="space-y-4">
        <div
          v-for="appointment in appointments"
          :key="appointment.id"
          class="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
        >
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ appointment.service.name }}
                </h3>
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : appointment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ getStatusText(appointment.status) }}
                </span>
              </div>

              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600"
              >
                <div class="flex items-center">
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
                  {{ appointment.calendar ? formatDate(appointment.calendar.date) : 'Date non définie' }}
                </div>

                <div class="flex items-center">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span v-if="appointment.calendar">
                    {{ appointment.calendar.startTime }} -
                    {{ appointment.calendar.endTime }}
                  </span>
                  <span v-else>Heure non définie</span>
                </div>

                <div class="flex items-center">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  {{ appointment.provider.firstName }}
                  {{ appointment.provider.lastName }}
                </div>

                <div class="flex items-center">
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    ></path>
                  </svg>
                  {{ appointment.service.price }}
                  {{ appointment.service.currency }}
                </div>
              </div>

              <p
                v-if="appointment.service.description"
                class="mt-3 text-sm text-gray-600"
              >
                {{ appointment.service.description }}
              </p>
              
              <p
                v-if="appointment.notes"
                class="mt-2 text-sm text-gray-600 italic"
              >
                <strong>Notes:</strong> {{ appointment.notes }}
              </p>
            </div>

            <div class="mt-4 md:mt-0 md:ml-6 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {{ t('appointments.actions.modify') }}
              </button>
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {{ t('appointments.actions.cancel') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Aucun rendez-vous -->
        <div v-if="appointments?.length === 0" class="text-center py-8">
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
            {{ t('appointments.noAppointments.title') }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ t('appointments.noAppointments.subtitle') }}
          </p>
          <div class="mt-6">
            <router-link
              to="/providers"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {{ t('appointments.noAppointments.bookNow') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAppointments } from '../hooksQuerie/appointments'
import arriere from '../assets/333.jpg'

const { t } = useI18n()

// Hook pour récupérer les rendez-vous
const { appointments, isLoading, isError } = useAppointments()

// Fonction pour formater la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Fonction pour obtenir le texte du statut
const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed':
      return t('appointments.status.confirmed')
    case 'pending':
      return t('appointments.status.pending')
    case 'cancelled':
      return t('appointments.status.cancelled')
    default:
      return status
  }
}
</script>
