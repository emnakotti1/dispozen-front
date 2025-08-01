<script setup>
import { RouterLink } from 'vue-router'
import logo from '../assets/logo.png'
import { useI18n } from 'vue-i18n'
import LanguageSelector from '../components/LanguageSelector.vue'

const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Partie gauche (formulaire) -->
    <div
      class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <!-- Logo et titre -->
        <div class="text-center">
          <!-- Sélecteur de langue en haut à droite -->
          <div class="flex justify-end mb-4">
            <LanguageSelector />
          </div>
          <img
            class="h-16 w-auto mx-auto"
            :src="logo"
            alt="Logo de l'entreprise"
          />
          <h2 class="mt-8 text-2xl font-bold tracking-tight text-gray-900">
            {{ t('message.auth.login.title') }}
          </h2>
          <p class="mt-2 text-sm text-gray-500">
            {{ t('message.auth.login.subtitle') }}
            <RouterLink
              to="/register"
              class="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              {{ t('message.auth.login.createAccount') }}
            </RouterLink>
          </p>
        </div>

        <!-- Formulaire -->
        <div class="mt-10">
          <form action="#" method="POST" class="space-y-6">
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-900"
                >{{ t('message.auth.login.email') }}</label
              >
              <input
                type="email"
                id="email"
                name="email"
                autocomplete="email"
                required
                class="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-900"
                >{{ t('message.auth.login.password') }}</label
              >
              <input
                type="password"
                id="password"
                name="password"
                autocomplete="current-password"
                required
                class="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label for="remember-me" class="text-sm text-gray-900">{{
                  t('message.auth.login.rememberMe')
                }}</label>
              </div>

              <div class="text-sm">
                <a
                  href="#"
                  class="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  {{ t('message.auth.login.forgotPassword') }}
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline focus:ring-2 focus:ring-indigo-600"
              >
                {{ t('message.auth.login.signIn') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Ou continuer avec -->
        <div class="mt-10">
          <div class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-4 text-gray-500">{{
                t('message.auth.login.orContinueWith')
              }}</span>
            </div>
          </div>

          <!-- Bouton Google -->
          <div class="mt-6">
            <a
              href="#"
              class="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M21.35 11.1h-9.17v2.92h5.35c-.23 1.28-1.44 3.76-5.35 3.76-3.23 0-5.87-2.69-5.87-6s2.64-6 5.87-6c1.84 0 3.07.79 3.78 1.48l2.59-2.5C17.1 2.9 14.9 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c5.71 0 9.46-4.04 9.46-9.7 0-.66-.11-1.2-.23-1.7z"
                />
              </svg>
              <span>{{ t('message.auth.login.continueWithGoogle') }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Partie droite (image) -->
    <div class="relative hidden w-0 flex-1 lg:block">
      <img
        class="absolute inset-0 w-full h-full object-cover"
        src="https://images.unsplash.com/photo-1601342630314-8427c38bf5e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2FsZW5kcmllcnxlbnwwfHwwfHx8Mg%3D%3D"
        alt="Image d'arrière-plan"
      />
    </div>
  </div>
</template>
