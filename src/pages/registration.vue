<script setup>
import { RouterLink } from "vue-router";
import logo from "../assets/logo.png";
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Partie gauche : formulaire -->
    <div class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div class="text-center">
          <img class="h-16 w-auto mx-auto" :src="logo" alt="Logo de l'entreprise" />
          <h2 class="mt-8 text-2xl font-bold tracking-tight text-gray-900">
            Créer un nouveau compte
          </h2>
          <p class="mt-2 text-sm text-gray-500">
            Vous avez déjà un compte ?
            <RouterLink
              to="/login"
              class="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Connectez-vous
            </RouterLink>
          </p>
        </div>

        <div class="mt-10">
          <form action="#" method="POST" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-900">
                Adresse e-mail
              </label>
              <div class="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-900">
                Mot de passe
              </label>
              <div class="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                Créer le compte
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Partie droite : image -->
    <div class="relative hidden w-0 flex-1 lg:block">
      <img
        class="absolute inset-0 w-full h-full object-cover"
        src="https://images.unsplash.com/photo-1601342630314-8427c38bf5e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2FsZW5kcmllcnxlbnwwfHwwfHx8Mg%3D%3D"
        alt="Image d’arrière-plan"
      />
    </div>
  </div>
</template>
