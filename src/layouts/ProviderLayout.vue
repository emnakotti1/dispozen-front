<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Sidebar -->
    <div class="flex">
      <!-- Sidebar -->
      <div class="w-64 bg-white shadow-lg min-h-screen">
        <div class="p-6">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Dashboard Provider</h1>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="mt-8">
          <div class="px-4 space-y-2">
            <!-- Vue d'ensemble -->
            <router-link
              to="/provider/dashboard"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="
                $route.path === '/provider/dashboard'
                  ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              "
            >
              <svg
                class="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              Vue d'ensemble
            </router-link>

            <!-- Mon Profil -->
            <router-link
              to="/provider/profile"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="
                $route.path === '/provider/profile'
                  ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              "
            >
              <svg
                class="w-5 h-5 mr-3"
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
              Mon Profil
            </router-link>

            <!-- Réservations -->
            <router-link
              to="/provider/appointments"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="
                $route.path === '/provider/appointments'
                  ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              "
            >
              <svg
                class="w-5 h-5 mr-3"
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
              Réservations
            </router-link>

            <!-- Calendrier du jour -->
            <router-link
              to="/provider/calendar/today"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="
                $route.path === '/provider/calendar/today'
                  ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              "
            >
              <svg
                class="w-5 h-5 mr-3"
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
              Calendrier du jour
            </router-link>

            <!-- Calendrier général -->
            <router-link
              to="/provider/calendar"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="
                $route.path === '/provider/calendar'
                  ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              "
            >
              <svg
                class="w-5 h-5 mr-3"
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
              Calendrier général
            </router-link>
          </div>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">
                  {{ pageTitle }}
                </h2>
                <p class="text-sm text-gray-600">{{ pageDescription }}</p>
              </div>

            
            
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="p-6">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { currentUser, logout: authLogout } = useAuth()

// Page titles based on current route
const pageTitle = computed(() => {
  switch (route.path) {
    case '/provider/dashboard':
      return "Vue d'ensemble"
    case '/provider/profile':
      return 'Mon Profil'
    case '/provider/appointments':
      return 'Réservations'
    case '/provider/calendar/today':
      return 'Calendrier du jour'
    case '/provider/calendar':
      return 'Calendrier général'
    default:
      return 'Dashboard Provider'
  }
})

const pageDescription = computed(() => {
  switch (route.path) {
    case '/provider/dashboard':
      return 'Aperçu de votre activité et statistiques'
    case '/provider/profile':
      return 'Gérez vos informations personnelles et vos services'
    case '/provider/appointments':
      return 'Gérez toutes vos réservations'
    case '/provider/calendar/today':
      return "Vos rendez-vous d'aujourd'hui"
    case '/provider/calendar':
      return 'Vue complète de votre planning'
    default:
      return ''
  }
})

const logout = async () => {
  await authLogout()
  router.push('/login')
}
</script>
