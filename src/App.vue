<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

// Obtenir la route actuelle
const route = useRoute()

// Liste des routes sans layout
const noLayoutRoutes = ['/login', '/register']

// Déterminer si on doit cacher le layout
const hideLayout = computed(() => noLayoutRoutes.includes(route.path))
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header uniquement si on ne cache pas le layout -->
    <Header v-if="!hideLayout" />

    <main class="flex-grow">
      <router-view />
    </main>

    <!-- Footer uniquement si on ne cache pas le layout -->
    <Footer v-if="!hideLayout" />

  </div>
</template>

<style scoped>
/* styles globaux éventuels */
</style>
