import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/login.vue'
import Register from '../pages/registration.vue'
import ProvidersList from '../pages/ProvidersList.vue'
import ProviderServices from '../pages/ProviderServices.vue'
import TestAuth from '../pages/TestAuth.vue'
import { authGuard, guestGuard } from './guards'

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
    path: '/test-auth',
    component: TestAuth, // Page de test - pas de guard
  },
  { path: '/', redirect: '/login' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
