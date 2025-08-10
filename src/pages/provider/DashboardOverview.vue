<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="border-b border-gray-200 pb-5">
      <h3 class="text-lg font-medium leading-6 text-gray-900">
        Vue d'ensemble
      </h3>
      <p class="mt-2 max-w-4xl text-sm text-gray-500">
        Aperçu de votre activité et des prochains rendez-vous
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
      >
        <dt>
          <div class="absolute rounded-md p-3" :class="stat.iconBackground">
            <component
              :is="stat.icon"
              class="h-6 w-6 text-white"
              aria-hidden="true"
            />
          </div>
          <p class="ml-16 truncate text-sm font-medium text-gray-500">
            {{ stat.name }}
          </p>
        </dt>
        <dd class="ml-16 flex items-baseline">
          <p class="text-2xl font-semibold text-gray-900">{{ stat.value }}</p>
          <p
            class="ml-2 flex items-baseline text-sm font-semibold"
            :class="
              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            "
          >
            <component
              :is="stat.changeType === 'increase' ? ArrowUpIcon : ArrowDownIcon"
              class="h-4 w-4 flex-shrink-0 self-center"
              aria-hidden="true"
            />
            <span class="sr-only"
              >{{
                stat.changeType === 'increase' ? 'Increased' : 'Decreased'
              }}
              by</span
            >
            {{ stat.change }}
          </p>
        </dd>
      </div>
    </div>

    <!-- Today's Appointments -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-gray-900 mb-4">
          Rendez-vous d'aujourd'hui
        </h3>
        <div class="flow-root">
          <ul role="list" class="-my-5 divide-y divide-gray-200">
            <li
              v-for="appointment in todayAppointments"
              :key="appointment.id"
              class="py-4"
            >
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <img
                    class="h-8 w-8 rounded-full"
                    :src="appointment.client.avatar"
                    :alt="appointment.client.name"
                  />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-gray-900">
                    {{ appointment.client.name }}
                  </p>
                  <p class="truncate text-sm text-gray-500">
                    {{ appointment.service }}
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="text-sm text-gray-500">
                    {{ appointment.time }}
                  </div>
                  <span
                    class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                    :class="getStatusClass(appointment.status)"
                  >
                    {{ appointment.status }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="mt-6">
          <a
            href="#"
            @click="$emit('change-view', 'today')"
            class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Voir tous les rendez-vous du jour
          </a>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-gray-900 mb-4">
          Activité récente
        </h3>
        <div class="flow-root">
          <ul role="list" class="-mb-8">
            <li v-for="(item, itemIdx) in recentActivity" :key="item.id">
              <div class="relative pb-8">
                <span
                  v-if="itemIdx !== recentActivity.length - 1"
                  class="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
                <div class="relative flex items-start space-x-3">
                  <div class="relative">
                    <div
                      class="h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white"
                      :class="getActivityIconClass(item.type)"
                    >
                      <component
                        :is="getActivityIcon(item.type)"
                        class="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div>
                      <div class="text-sm">
                        <p class="font-medium text-gray-900">
                          {{ item.description }}
                        </p>
                      </div>
                      <p class="mt-0.5 text-sm text-gray-500">
                        {{ item.time }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'

// Emit events
defineEmits(['change-view'])

// Mock data - à remplacer par de vraies données d'API
const stats = [
  {
    name: 'Rendez-vous ce mois',
    value: '42',
    change: '12%',
    changeType: 'increase',
    icon: CalendarDaysIcon,
    iconBackground: 'bg-indigo-500',
  },
  {
    name: 'Revenus ce mois',
    value: '€2,340',
    change: '8%',
    changeType: 'increase',
    icon: CurrencyDollarIcon,
    iconBackground: 'bg-green-500',
  },
  {
    name: 'Clients actifs',
    value: '28',
    change: '3%',
    changeType: 'increase',
    icon: UsersIcon,
    iconBackground: 'bg-yellow-500',
  },
  {
    name: "Taux d'occupation",
    value: '78%',
    change: '2%',
    changeType: 'decrease',
    icon: ClockIcon,
    iconBackground: 'bg-purple-500',
  },
]

const todayAppointments = [
  {
    id: 1,
    client: {
      name: 'Marie Dubois',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    service: 'Consultation',
    time: '09:00',
    status: 'Confirmé',
  },
  {
    id: 2,
    client: {
      name: 'Pierre Martin',
      avatar:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    service: 'Suivi',
    time: '14:30',
    status: 'En attente',
  },
  {
    id: 3,
    client: {
      name: 'Sophie Laurent',
      avatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    service: 'Consultation',
    time: '16:00',
    status: 'Confirmé',
  },
]

const recentActivity = [
  {
    id: 1,
    type: 'appointment',
    description: 'Nouveau rendez-vous réservé par Marie Dubois',
    time: 'Il y a 2 heures',
  },
  {
    id: 2,
    type: 'cancellation',
    description: 'Rendez-vous annulé par Jean Dupont',
    time: 'Il y a 4 heures',
  },
  {
    id: 3,
    type: 'new_client',
    description: 'Nouveau client inscrit : Sophie Laurent',
    time: 'Hier',
  },
]

// Methods
const getStatusClass = (status: string) => {
  switch (status) {
    case 'Confirmé':
      return 'bg-green-100 text-green-800'
    case 'En attente':
      return 'bg-yellow-100 text-yellow-800'
    case 'Annulé':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getActivityIconClass = (type: string) => {
  switch (type) {
    case 'appointment':
      return 'bg-green-500'
    case 'cancellation':
      return 'bg-red-500'
    case 'new_client':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'appointment':
      return CheckCircleIcon
    case 'cancellation':
      return XCircleIcon
    case 'new_client':
      return PlusIcon
    default:
      return CheckCircleIcon
  }
}
</script>
