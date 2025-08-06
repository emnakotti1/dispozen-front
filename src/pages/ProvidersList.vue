<template>
  <div>
    <Header />  <!-- Ton Header réutilisable -->

    <!-- Main Content -->
    <div class="min-h-screen bg-white py-10 px-6">
      <!-- Search Bar -->
      <div class="max-w-4xl mx-auto mb-8">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un provider..."
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <!-- Status States -->
      <div v-if="isLoading" class="text-center">Chargement...</div>
      <div v-else-if="isError" class="text-center text-red-500">Erreur lors du chargement.</div>

      <!-- Providers List -->
      <div v-else class="mx-auto max-w-7xl">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="provider in filteredProviders"
            :key="provider.firstName + provider.lastName"
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
      </div>
    </div>

    <Footer />  <!-- Ton Footer réutilisable -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { useProvidersQuery } from '../hooksQuerie/providers'

const searchQuery = ref('')
const { data: providersData, isLoading, isError } = useProvidersQuery()

const filteredProviders = computed(() => {
  if (!providersData.value) return []
  const query = searchQuery.value.toLowerCase()
  return providersData.value.filter(provider =>
    (`${provider.firstName} ${provider.lastName}`.toLowerCase().includes(query) ||
      provider.city.toLowerCase().includes(query))
  )
})

function getImageUrl(imagePath) {
  return imagePath ? `http://localhost:3000/${imagePath}` : ''
}
</script>
