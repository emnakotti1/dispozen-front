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
          {{ t('providerServices.title') }}
        </h1>
      </div>

      <!-- Loading / Error -->
      <div v-if="isLoading" class="text-center text-gray-500">
        {{ t('common.loading') }}
      </div>
      <div v-else-if="isError" class="text-center text-red-500">
        {{ t('common.error.loadingServices') }}
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-300 table-fixed">
          <thead>
            <tr class="bg-gray-100">
              <th
                class="w-1/4 py-3.5 px-4 text-left text-sm font-semibold text-gray-700"
              >
                {{ t('providerServices.table.headers.name') }}
              </th>
              <th
                class="w-1/2 px-4 py-3.5 text-left text-sm font-semibold text-gray-700"
              >
                {{ t('providerServices.table.headers.description') }}
              </th>
              <th
                class="w-1/8 px-4 py-3.5 text-left text-sm font-semibold text-gray-700"
              >
                {{ t('providerServices.table.headers.price') }}
              </th>
              <th
                class="w-1/8 px-4 py-3.5 text-left text-sm font-semibold text-gray-700"
              ></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="service in services"
              :key="service.id"
              class="hover:bg-gray-50"
            >
              <td
                class="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900"
              >
                {{ service.name }}
              </td>
              <td
                class="px-4 py-4 text-sm text-gray-600 truncate max-w-xs"
                :title="service.description"
              >
                {{ service.description }}
              </td>
              <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                {{ service.price }} {{ service.currency }}
              </td>
              <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                <router-link
                  :to="{
                    path: `/booking/${providerId}/${service.id}`,
                    query: { providerName: 'Provider Name' },
                  }"
                  class="rounded bg-indigo-600 text-white px-3 py-1 text-sm font-semibold shadow hover:bg-indigo-700 transition-colors"
                >
                  {{ t('button.book') }}
                </router-link>
              </td>
            </tr>
            <tr v-if="services?.length === 0">
              <td colspan="4" class="text-center py-4 text-sm text-gray-500">
                {{ t('common.noData.services') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useProviderServicesQuery } from '../hooksQuerie/useProviderServicesQuery'
import { useI18n } from 'vue-i18n'
import arriere from '../assets/333.jpg'

const route = useRoute()
const providerId = route.params.id as string
const { t } = useI18n()

const { services, isLoading, isError } = useProviderServicesQuery(providerId)
</script>
