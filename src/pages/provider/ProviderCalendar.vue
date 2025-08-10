<template>
  <div class="space-y-6">
    <!-- Calendar Header -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            {{ currentMonthYear }}
          </h2>
          <p class="text-sm text-gray-600">
            {{ monthlyStats.total }} rendez-vous ce mois
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <button
            @click="previousMonth"
            class="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <button
            @click="goToToday"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Aujourd'hui
          </button>
          <button
            @click="nextMonth"
            class="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Days of Week Header -->
      <div class="grid grid-cols-7 gap-px bg-gray-200">
        <div v-for="day in daysOfWeek" :key="day" class="bg-gray-50 py-2 px-3">
          <div
            class="text-xs font-medium text-gray-500 uppercase tracking-wide text-center"
          >
            {{ day }}
          </div>
        </div>
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-px bg-gray-200">
        <div
          v-for="day in calendarDays"
          :key="`${day.date}-${day.isCurrentMonth}`"
          :class="[
            'bg-white p-2 h-32 relative',
            !day.isCurrentMonth ? 'bg-gray-50' : '',
            day.isToday ? 'bg-blue-50' : '',
          ]"
        >
          <!-- Day Number -->
          <div class="flex items-center justify-between">
            <span
              :class="[
                'text-sm font-medium',
                !day.isCurrentMonth ? 'text-gray-400' : 'text-gray-900',
                day.isToday
                  ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs'
                  : '',
              ]"
            >
              {{ day.day }}
            </span>
          </div>

          <!-- Appointments for this day -->
          <div class="mt-1 space-y-1 overflow-hidden">
            <div
              v-for="appointment in day.appointments.slice(0, 3)"
              :key="appointment.id"
              :class="[
                'text-xs px-2 py-1 rounded truncate cursor-pointer',
                appointment.status === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : appointment.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : appointment.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800',
              ]"
              @click="selectAppointment(appointment)"
            >
              {{ appointment.calendar?.startTime }} -
              {{ appointment.client.firstName }}
              {{ appointment.client.lastName }}
            </div>

            <!-- More appointments indicator -->
            <div
              v-if="day.appointments.length > 3"
              class="text-xs text-gray-500 px-2"
            >
              +{{ day.appointments.length - 3 }} autre(s)
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Monthly Statistics -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Confirmés
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ monthlyStats.confirmed }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

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
                  {{ monthlyStats.pending }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center"
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
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Annulés
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ monthlyStats.cancelled }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
      <div class="flex space-x-4">
        <router-link
          to="/provider/calendar/today"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          Voir aujourd'hui
        </router-link>
        <router-link
          to="/provider/appointments"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
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
import { computed, ref } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useProviderAppointments } from '../../hooksQuerie/appointments'

const { currentUser } = useAuth()
const providerId = computed(() => currentUser.value?.id || '')

// Calendar state
const currentDate = ref(new Date())

// Get appointments data
const { appointments } = useProviderAppointments(providerId.value)

const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const currentMonthYear = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(currentDate.value)
})

// Calendar navigation
const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1,
  )
}

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1,
  )
}

const goToToday = () => {
  currentDate.value = new Date()
}

// Build calendar days
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  // First day of the month
  const firstDay = new Date(year, month, 1)

  // Start from Monday of the week containing the first day
  const startDate = new Date(firstDay)
  const dayOfWeek = firstDay.getDay()
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  startDate.setDate(startDate.getDate() - daysToSubtract)

  const days = []
  const currentDateObj = new Date(startDate)

  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const dateString = currentDateObj.toISOString().split('T')[0]
    const isCurrentMonth = currentDateObj.getMonth() === month
    const isToday = dateString === new Date().toISOString().split('T')[0]

    // Get appointments for this day
    const dayAppointments =
      appointments.value?.filter(appointment => {
        const appointmentDate = appointment.calendar?.date
        return appointmentDate === dateString
      }) || []

    days.push({
      date: dateString,
      day: currentDateObj.getDate(),
      isCurrentMonth,
      isToday,
      appointments: dayAppointments,
    })

    currentDateObj.setDate(currentDateObj.getDate() + 1)
  }

  return days
})

// Monthly statistics
const monthlyStats = computed(() => {
  if (!appointments.value)
    return { total: 0, confirmed: 0, pending: 0, cancelled: 0 }

  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const monthlyAppointments = appointments.value.filter(appointment => {
    const appointmentDate = new Date(appointment.calendar?.date || '')
    return (
      appointmentDate.getFullYear() === year &&
      appointmentDate.getMonth() === month
    )
  })

  return {
    total: monthlyAppointments.length,
    confirmed: monthlyAppointments.filter(apt => apt.status === 'confirmed')
      .length,
    pending: monthlyAppointments.filter(apt => apt.status === 'pending').length,
    cancelled: monthlyAppointments.filter(apt => apt.status === 'cancelled')
      .length,
  }
})

const selectAppointment = (_: any) => {
  // Navigate to appointment details or show modal
}
</script>
