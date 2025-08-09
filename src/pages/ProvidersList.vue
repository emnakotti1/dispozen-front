<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/vue/20/solid'
import { PhoneIcon, EnvelopeIcon } from '@heroicons/vue/24/solid'
import { useProvidersQuery } from '../hooksQuerie/useProvidersQuery'

const { t } = useI18n()
const searchQuery = ref('')
const debouncedSearchQuery = ref('')
const limit = 6

// Debounce search to avoid too many API calls
let debounceTimeout: ReturnType<typeof setTimeout>
watch(
  searchQuery,
  newValue => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      debouncedSearchQuery.value = newValue
    }, 300) // 300ms debounce
  },
  { immediate: true },
)

const {
  data,
  isLoading,
  isError,
  currentPage,
  nextPage,
  prevPage,
  isFetching,
  resetPage,
} = useProvidersQuery(limit, debouncedSearchQuery)

// Reset to page 1 when search changes
watch(debouncedSearchQuery, () => {
  resetPage()
})

function getImageUrl(imagePath: string) {
  return imagePath ? `http://localhost:3000/${imagePath}` : ''
}
</script>

<template>
  <div class="relative min-h-screen py-10 px-6 max-w-7xl mx-auto">
    <!-- Image d'arrière-plan fixe -->
    <div class="fixed inset-0 bg-cover bg-center -z-10"></div>

    <!-- Search Bar -->
    <div class="max-w-4xl mx-auto mb-8 relative z-10">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('providers.search.placeholder')"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
      />
    </div>

    <!-- Status Messages -->
    <div v-if="isLoading" class="text-center relative z-10">
      {{ t('providers.status.loading') }}
    </div>
    <div v-else-if="isError" class="text-center text-red-500 relative z-10">
      {{ t('providers.status.error') }}
    </div>

    <!-- Providers List -->
    <div
      v-else
      class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 relative z-10"
    >
      <div
        v-for="(provider, index) in data"
        :key="provider.id ?? index"
        class="rounded-2xl shadow hover:shadow-lg transition p-4 border border-gray-200 bg-white"
      >
        <!-- Image -->
        <img
          :src="getImageUrl(provider.imageUrl)"
          :alt="`${provider.firstName} ${provider.lastName}`"
          class="aspect-[3/2] w-full rounded-lg object-cover"
        />

        <!-- Name & Info -->
        <h3 class="mt-4 text-lg font-semibold text-gray-900">
          {{ provider.firstName }} {{ provider.lastName }}
        </h3>
        <p class="text-sm text-gray-600">{{ provider.address }}</p>
        <p class="text-sm text-gray-500">{{ provider.city }}</p>

        <!-- Actions Row -->
        <div class="mt-4 flex items-center justify-between">
          <!-- Button -->
          <RouterLink
            :to="`/providers/${provider.id}/services`"
            class="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
          >
            {{ t('common.navigation.services') }}
          </RouterLink>

          <!-- Contact Icons -->
          <div class="flex items-center gap-4 text-gray-600">
            <div class="flex items-center gap-1" v-if="provider.phoneNumber">
              <PhoneIcon class="h-5 w-5 text-gray-600 flex-shrink-0" />
            </div>
            <div class="flex items-center gap-1" v-if="provider.email">
              <EnvelopeIcon class="h-5 w-5 text-gray-600 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <nav
      class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-8 relative z-10"
    >
      <button
        @click="prevPage"
        :disabled="currentPage === 1 || isFetching"
        class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLongLeftIcon
          class="mr-3 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        {{ t('providers.pagination.previous') }}
      </button>

      <button
        @click="nextPage"
        :disabled="(data && data.length < limit) || isFetching"
        class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ t('providers.pagination.next') }}
        <ArrowLongRightIcon
          class="ml-3 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </button>
    </nav>
  </div>
</template>
