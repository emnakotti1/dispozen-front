import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/login.vue'
import Register from '../pages/registration.vue'
import ProvidersList from '../pages/ProvidersList.vue'
import ProviderServices from '../pages/ProviderServices.vue'
import BookingPage from '../pages/BookingPage.vue'
import AppointmentsList from '../pages/AppointmentsList.vue'
import AppointmentDetails from '../pages/AppointmentDetails.vue'
import TestAuth from '../pages/TestAuth.vue'
import ProviderLayout from '../layouts/ProviderLayout.vue'
import ProviderOverview from '../pages/provider/ProviderOverview.vue'
import ProviderProfile from '../pages/provider/ProviderProfile.vue'
import TestUserUpdate from '../pages/TestUserUpdate.vue'
import ProviderAppointments from '../pages/provider/ProviderAppointments.vue'
import ProviderCalendarToday from '../pages/provider/ProviderCalendarToday.vue'
import ProviderCalendar from '../pages/provider/ProviderCalendar.vue'
import { authGuard, guestGuard, providerGuard } from './guards'

const routes = [
  {
    path: '/login',
    component: Login,
    beforeEnter: guestGuard, // Rediriger si déjà connecté
  },
  {
    path: '/register',
    component: Register,
    beforeEnter: guestGuard, // Rediriger si déjà connecté
  },
  {
    path: '/providers',
    component: ProvidersList,
    beforeEnter: authGuard, // Protéger cette route
  },
  {
    path: '/providers/:id/services',
    component: ProviderServices,
    beforeEnter: authGuard, // Protéger cette route
  },
  {
    path: '/booking/:providerId/:serviceId',
    component: BookingPage,
    beforeEnter: authGuard, // Protéger cette route
  },
  {
    path: '/appointments',
    component: AppointmentsList,
    beforeEnter: authGuard, // Protéger cette route
  },
  {
    path: '/appointments/:id',
    component: AppointmentDetails,
    beforeEnter: authGuard, // Protéger cette route
  },
  {
    path: '/test-user-update',
    component: TestUserUpdate,
    beforeEnter: authGuard, // Protéger cette route
  },
  {
    path: '/provider',
    component: ProviderLayout,
    beforeEnter: providerGuard, // Protéger cette route pour les providers seulement
    children: [
      {
        path: 'dashboard',
        component: ProviderOverview,
      },
      {
        path: 'profile',
        component: ProviderProfile,
      },
      {
        path: 'appointments',
        component: ProviderAppointments,
      },
      {
        path: 'calendar/today',
        component: ProviderCalendarToday,
      },
      {
        path: 'calendar',
        component: ProviderCalendar,
      },
      {
        path: '',
        redirect: '/provider/dashboard',
      },
    ],
  },
  {
    path: '/test-auth',
    component: TestAuth, // Page de test - pas de guard
  },
  {
    path: '/',
    redirect: () => {
      // Redirection intelligente selon le rôle
      const userRole = localStorage.getItem('userRole')
      const token = localStorage.getItem('accessToken')

      if (token && userRole === 'provider') {
        return '/provider/dashboard'
      } else if (token) {
        return '/providers'
      } else {
        return '/login'
      }
    },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
