<template>
  <div>
    <Header />

    <div class="min-h-screen bg-white py-10 px-6 max-w-7xl mx-auto">
      <!-- Search Bar -->
      <div class="max-w-4xl mx-auto mb-8">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un provider..."
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <!-- Status -->
      <div v-if="isLoading" class="text-center">Chargement...</div>
      <div v-else-if="isError" class="text-center text-red-500">Erreur lors du chargement.</div>

      <!-- Providers List -->
      <div v-else class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(provider, index) in filteredProviders"
          :key="provider.id ?? index"  
          class="rounded-2xl shadow hover:shadow-lg transition p-4 border border-gray-200"
        >
          <img
            :src="getImageUrl(provider.imageUrl)"
            :alt="`${provider.firstName} ${provider.lastName}`"
            class="aspect-[3/2] w-full rounded-lg object-cover"
          />
          <h3 class="mt-4 text-lg font-semibold text-gray-900">
            {{ provider.firstName }} {{ provider.lastName }}
          </h3>
          <p class="text-sm text-gray-600">{{ provider.city }}</p>
        </div>
      </div>

      <!-- Pagination Controls -->
      <nav class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-8">
        <button
          @click="fetchPreviousPage"
          :disabled="!hasPreviousPage || isFetching"
          class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLongLeftIcon class="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Previous
        </button>

        <button
          @click="fetchNextPage"
          :disabled="!hasNextPage || isFetching"
          class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ArrowLongRightIcon class="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </nav>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/vue/20/solid'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { useProvidersInfiniteQuery } from '../hooksQuerie/providers'

const searchQuery = ref('')
const limit = 6

const {
  data,
  isLoading,
  isError,
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  hasPreviousPage,
  isFetching,
} = useProvidersInfiniteQuery(limit)

// Fusionner toutes les pages en un seul tableau
const allProviders = computed(() => {
  if (!data.value) return []
  return data.value.pages.flat()
})

// Filtrer selon la recherche
const filteredProviders = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return allProviders.value.filter(provider =>
    (`${provider.firstName} ${provider.lastName}`.toLowerCase().includes(query) ||
      provider.city.toLowerCase().includes(query))
  )
})

function getImageUrl(imagePath) {
  return imagePath ? `http://localhost:3000/${imagePath}` : ''
}
</script>
