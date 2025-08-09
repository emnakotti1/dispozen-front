<template>
  <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">🧪 Test du composable Auth</h2>

    <div class="space-y-4">
      <button
        @click="testTokenDecoding"
        class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Tester décodage du token
      </button>

      <button
        @click="testManualLogin"
        class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Simuler connexion avec votre token
      </button>

      <button
        @click="clearAuth"
        class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Vider l'authentification
      </button>
    </div>

    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="font-semibold mb-2">État actuel :</h3>
      <p><strong>Authentifié :</strong> {{ isAuthenticated ? '✅' : '❌' }}</p>
      <p>
        <strong>Utilisateur :</strong> {{ currentUser?.firstname || 'Aucun' }}
      </p>
      <p><strong>Email :</strong> {{ currentUser?.email || 'Aucun' }}</p>
      <p><strong>ID :</strong> {{ currentUser?.id || 'Aucun' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const { isAuthenticated, currentUser, login, logout } = useAuth()
const router = useRouter()

// Votre token exact pour test
const testToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNmQxM2NmNC03N2YwLTQ0ZWMtYjRhNS00MzE0MjQ0Y2UxODEiLCJlbWFpbCI6InRlc3QwMUBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJ0ZXN0MDEiLCJsYXN0TmFtZSI6ImtvdHRpIiwicm9sZSI6ImNsaWVudCIsImlhdCI6MTc1NDc0MjMzNiwiZXhwIjoxNzU0NzQ1OTM2fQ.4xJjpppHji70KTvE4sYYxngtL7iHVrFLQHSPlvPP-y0'

const testTokenDecoding = () => {
  try {
    const payload = JSON.parse(atob(testToken.split('.')[1]))
    console.log('🎫 Token décodé:', payload)
    alert('Vérifiez la console pour voir le token décodé !')
  } catch (error) {
    console.error('❌ Erreur décodage:', error)
    alert('Erreur lors du décodage du token')
  }
}

const testManualLogin = () => {
  // Simuler la réponse de votre API
  const mockApiResponse = {
    access_token: testToken,
    role: 'client',
  }

  console.log('🧪 Simulation de connexion avec:', mockApiResponse)
  login(mockApiResponse)

  setTimeout(() => {
    if (isAuthenticated.value) {
      alert('✅ Connexion réussie ! Redirection vers /providers...')
      router.push('/providers')
    } else {
      alert('❌ Échec de la connexion')
    }
  }, 100)
}

const clearAuth = () => {
  logout()
  alert('🗑️ Authentification supprimée')
}
</script>
