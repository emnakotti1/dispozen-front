<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import logo from "../assets/logo.png";
import { useI18n } from "vue-i18n";
import LanguageSelector from "../components/LanguageSelector.vue";
import { ref } from "vue";
import { useCreateUserMutation } from "../hooksQuerie/users";

const { t } = useI18n();
const router = useRouter();

// Champs du formulaire
const firstName = ref("");
const lastName = ref("");
const phoneNumber = ref("");
const email = ref("");
const password = ref("");

// Mutation
const {
  mutate: createUser,
  isPending,
  isError,
  error,
} = useCreateUserMutation();

function handleSubmit(e: Event) {
  e.preventDefault();

  createUser(
    {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      phoneNumber: phoneNumber.value,
    },
    {
      onSuccess: () => {
        router.push("/login"); // ou afficher un message
      },
    }
  );
}
</script>

<template>
  <div class="flex min-h-screen">
    <div
      class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div class="text-center">
          <div class="flex justify-end mb-4">
            <LanguageSelector />
          </div>
          <img class="h-16 w-auto mx-auto" :src="logo" alt="Logo" />
          <h2 class="mt-8 text-2xl font-bold tracking-tight text-gray-900">
            {{ t("message.auth.registration.title") }}
          </h2>
          <p class="mt-2 text-sm text-gray-500">
            {{ t("message.auth.registration.subtitle") }}
            <RouterLink
              to="/login"
              class="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              {{ t("message.auth.registration.signIn") }}
            </RouterLink>
          </p>
        </div>

        <form @submit="handleSubmit" class="space-y-6 mt-10">
          <div>
            <label
              for="firstName"
              class="block text-sm font-medium text-gray-900"
            >
              {{ t("message.auth.registration.firstName") }}
            </label>
            <input
              id="firstName"
              v-model="firstName"
              type="text"
              autocomplete="given-name"
              required
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              for="lastName"
              class="block text-sm font-medium text-gray-900"
            >
              {{ t("message.auth.registration.lastName") }}
            </label>
            <input
              id="lastName"
              v-model="lastName"
              type="text"
              autocomplete="family-name"
              required
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              for="phoneNumber"
              class="block text-sm font-medium text-gray-900"
            >
              {{ t("message.auth.registration.phoneNumber") }}
            </label>
            <input
              id="phoneNumber"
              v-model="phoneNumber"
              type="tel"
              autocomplete="tel"
              required
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-900">
              {{ t("message.auth.registration.email") }}
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-900"
            >
              {{ t("message.auth.registration.password") }}
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <button
              type="submit"
              :disabled="isPending"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              {{
                isPending
                  ? t("common.loading")
                  : t("message.auth.registration.createAccount")
              }}
            </button>
            <p v-if="isError" class="mt-2 text-sm text-red-600">
              {{ error?.message || "Une erreur est survenue" }}
            </p>
          </div>
        </form>
      </div>
    </div>

    <div class="relative hidden w-0 flex-1 lg:block">
      <img
        class="absolute inset-0 w-full h-full object-cover"
        src="https://images.unsplash.com/photo-1601342630314-8427c38bf5e6?w=600"
        alt="Background"
      />
    </div>
  </div>
</template>
