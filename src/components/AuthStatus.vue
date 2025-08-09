// Exemple d'utilisation du composable useAuth dans un composant Vue

<template>
  <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Statut d'authentification</h2>

    <div v-if="isAuthenticated" class="space-y-4">
      <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 class="text-lg font-semibold text-green-800">
          ✅ Utilisateur connecté
        </h3>
        <div class="mt-2 text-sm text-green-700">
          <p>
            <strong>Nom :</strong> {{ currentUser?.firstname }}
            {{ currentUser?.lastname }}
          </p>
          <p><strong>Email :</strong> {{ currentUser?.email }}</p>
          <p><strong>ID :</strong> {{ currentUser?.id }}</p>
        </div>
      </div>

      <div class="space-y-2">
        <button
          @click="handleLogout"
          class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Se déconnecter
        </button>

        <button
          @click="checkToken"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Vérifier la validité du token
        </button>
      </div>
    </div>

    <div v-else class="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h3 class="text-lg font-semibold text-red-800">
        ❌ Utilisateur non connecté
      </h3>
      <p class="mt-2 text-sm text-red-700">
        Vous devez vous connecter pour accéder aux fonctionnalités protégées.
      </p>
      <RouterLink
        to="/login"
        class="inline-block mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Se connecter
      </RouterLink>
    </div>

    <!-- Informations de debug -->
    <div class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h4 class="font-semibold text-gray-800">Informations de debug :</h4>
      <div class="mt-2 text-xs text-gray-600 space-y-1">
        <p><strong>Token présent :</strong> {{ !!getAccessToken() }}</p>
        <p><strong>Utilisateur en mémoire :</strong> {{ !!currentUser }}</p>
        <p><strong>Authentifié :</strong> {{ isAuthenticated }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()

// Utilisation du composable d'authentification
const {
  isAuthenticated,
  currentUser,
  logout,
  checkTokenValidity,
  getAccessToken,
} = useAuth()

// Fonction pour gérer la déconnexion
const handleLogout = () => {
  logout()
  router.push('/login')
}

// Fonction pour vérifier le token
const checkToken = () => {
  const isValid = checkTokenValidity()
  alert(isValid ? 'Token valide ✅' : 'Token invalide ou expiré ❌')
}
</script>
