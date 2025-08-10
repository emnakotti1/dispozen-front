<template>
  <div class="space-y-6">
    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Appointments -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
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
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Réservations
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.totalAppointments }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Appointments -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
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
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Aujourd'hui
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.todayAppointments }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Appointments -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
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
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  En attente
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.pendingAppointments }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Services -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
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
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Services Actifs
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.activeServices }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Recent Appointments -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Prochains rendez-vous
          </h3>
          <div v-if="appointmentsLoading" class="text-center py-4">
            <div
              class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"
            ></div>
            <p class="mt-2 text-sm text-gray-500">Chargement...</p>
          </div>
          <div
            v-else-if="recentAppointments && recentAppointments.length > 0"
            class="space-y-3"
          >
            <div
              v-for="appointment in recentAppointments.slice(0, 5)"
              :key="appointment.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <img
                    class="h-8 w-8 rounded-full"
                    :src="`https://ui-avatars.com/api/?name=${appointment.client.firstName}+${appointment.client.lastName}&background=6366f1&color=fff`"
                    :alt="`${appointment.client.firstName} ${appointment.client.lastName}`"
                  />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ appointment.client.firstName }}
                    {{ appointment.client.lastName }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ appointment.service.name }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">
                  {{ formatDate(appointment.calendar?.date || '') }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ appointment.calendar?.startTime }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
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
            <p class="mt-2 text-sm text-gray-500">Aucun rendez-vous à venir</p>
          </div>
          <div class="mt-4">
            <router-link
              to="/provider/appointments"
              class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Voir tous les rendez-vous →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Actions rapides
          </h3>
          <div class="space-y-3">
            <router-link
              to="/provider/profile"
              class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white"
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
                </div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">
                  Gérer mon profil
                </p>
                <p class="text-sm text-gray-500">
                  Modifier mes informations et services
                </p>
              </div>
            </router-link>

            <router-link
              to="/provider/calendar/today"
              class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white"
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
                </div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">
                  Voir mon planning du jour
                </p>
                <p class="text-sm text-gray-500">
                  Consultez vos rendez-vous d'aujourd'hui
                </p>
              </div>
            </router-link>

            <router-link
              to="/provider/appointments"
              class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white"
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
                </div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">
                  Gérer les réservations
                </p>
                <p class="text-sm text-gray-500">
                  Confirmer ou annuler des rendez-vous
                </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useProviderAppointments } from '../../hooksQuerie/appointments'
import { useProviderServices } from '../../hooksQuerie/services'

const { currentUser } = useAuth()
const providerId = computed(() => currentUser.value?.id || '')

// Get appointments and services data
const { appointments, isLoading: appointmentsLoading } =
  useProviderAppointments(providerId.value)

const { services } = useProviderServices(providerId.value)

// Recent appointments (next 5)
const recentAppointments = computed(() => {
  if (!appointments.value) return []

  const now = new Date()
  return appointments.value
    .filter(appointment => {
      const appointmentDate = new Date(appointment.calendar?.date || '')
      return appointmentDate >= now
    })
    .sort((a, b) => {
      const dateA = new Date(a.calendar?.date || '')
      const dateB = new Date(b.calendar?.date || '')
      return dateA.getTime() - dateB.getTime()
    })
    .slice(0, 5)
})

// Statistics
const stats = computed(() => {
  const today = new Date().toISOString().split('T')[0]

  const totalAppointments = appointments.value?.length || 0
  const todayAppointments =
    appointments.value?.filter(apt => apt.calendar?.date === today).length || 0
  const pendingAppointments =
    appointments.value?.filter(apt => apt.status === 'pending').length || 0
  const activeServices =
    services.value?.filter(service => service.status === 'active').length || 0

  return {
    totalAppointments,
    todayAppointments,
    pendingAppointments,
    activeServices,
  }
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}
</script>
