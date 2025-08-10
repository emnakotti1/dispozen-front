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
        Simuler connexion CLIENT
      </button>

      <button
        @click="testProviderLogin"
        class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Simuler connexion PROVIDER
      </button>

      <button
        @click="testRealProviderLogin"
        :disabled="isLoadingProvider"
        class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoadingProvider" class="inline-flex items-center">
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Test en cours...
        </span>
        <span v-else>Test REAL Provider Login (API)</span>
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
      <p><strong>Rôle :</strong> {{ getUserRole() || 'Aucun' }}</p>
    </div>

    <div class="mt-4 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold mb-2 text-blue-800">Instructions de test :</h3>
      <ol class="list-decimal list-inside text-sm text-blue-700 space-y-1">
        <li>
          Cliquez sur "Test REAL Provider Login" pour tester avec
          provider@gmail.com
        </li>
        <li>Vérifiez la console pour voir les logs détaillés</li>
        <li>
          La redirection devrait aller vers /provider/dashboard si c'est un
          provider
        </li>
        <li>
          Utilisez "Vider l'authentification" pour nettoyer entre les tests
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import { useLoginMutation } from '../hooksQuerie/auth'

const { isAuthenticated, currentUser, login, logout, getUserRole } = useAuth()
const router = useRouter()
const { mutate: loginMutation } = useLoginMutation()
const isLoadingProvider = ref(false)

// Votre token exact pour test (client)
const testToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNmQxM2NmNC03N2YwLTQ0ZWMtYjRhNS00MzE0MjQ0Y2UxODEiLCJlbWFpbCI6InRlc3QwMUBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJ0ZXN0MDEiLCJsYXN0TmFtZSI6ImtvdHRpIiwicm9sZSI6ImNsaWVudCIsImlhdCI6MTc1NDc0MjMzNiwiZXhwIjoxNzU0NzQ1OTM2fQ.4xJjpppHji70KTvE4sYYxngtL7iHVrFLQHSPlvPP-y0'

// Token de test pour provider (simulation)
const providerToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcm92aWRlci0xMjMiLCJlbWFpbCI6InByb3ZpZGVyQGV4YW1wbGUuY29tIiwiZmlyc3ROYW1lIjoiRHIuIEpvaG4iLCJsYXN0TmFtZSI6IkRvZSIsInJvbGUiOiJwcm92aWRlciIsImlhdCI6MTc1NDc0MjMzNiwiZXhwIjoxNzU0NzQ1OTM2fQ.mock_signature_for_provider'

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

  console.log('🧪 Simulation de connexion CLIENT avec:', mockApiResponse)
  login(mockApiResponse)

  setTimeout(() => {
    if (isAuthenticated.value) {
      alert('✅ Connexion CLIENT réussie ! Redirection vers /providers...')
      router.push('/providers')
    } else {
      alert('❌ Échec de la connexion')
    }
  }, 100)
}

const testProviderLogin = () => {
  // Simuler la réponse de votre API pour un provider
  const mockProviderResponse = {
    access_token: providerToken,
    role: 'provider',
    user: {
      id: 'provider-123',
      email: 'provider@example.com',
      firstname: 'Dr. John',
      lastname: 'Doe',
    },
  }

  console.log('🧪 Simulation de connexion PROVIDER avec:', mockProviderResponse)
  const userRole = login(mockProviderResponse)

  setTimeout(() => {
    if (isAuthenticated.value) {
      alert(
        `✅ Connexion PROVIDER réussie ! Rôle: ${userRole}. Redirection vers dashboard...`,
      )
      if (userRole === 'provider') {
        router.push('/provider/dashboard')
      } else {
        router.push('/providers')
      }
    } else {
      alert('❌ Échec de la connexion')
    }
  }, 100)
}

const clearAuth = () => {
  logout()
  alert('🗑️ Authentification supprimée')
}

const testRealProviderLogin = () => {
  console.log('🧪 Test de connexion provider avec la vraie API...')
  isLoadingProvider.value = true

  loginMutation(
    { email: 'provider@gmail.com', password: 'provider' },
    {
      onSuccess: data => {
        console.log("📥 Données reçues de l'API:", data)

        const userRole = login(data)
        console.log('🔄 Rôle utilisateur:', userRole)
        console.log(
          '💾 localStorage userRole:',
          localStorage.getItem('userRole'),
        )

        setTimeout(() => {
          if (isAuthenticated.value) {
            if (userRole === 'provider') {
              alert(
                '✅ Connexion PROVIDER réussie ! Redirection vers dashboard...',
              )
              router.push('/provider/dashboard')
            } else {
              alert(
                `✅ Connexion réussie ! Rôle: ${userRole}. Redirection vers providers...`,
              )
              router.push('/providers')
            }
          } else {
            alert('❌ Échec de la connexion')
          }
          isLoadingProvider.value = false
        }, 200)
      },
      onError: error => {
        console.error('❌ Erreur de connexion:', error)
        alert(`❌ Erreur de connexion: ${error.message || 'Erreur inconnue'}`)
        isLoadingProvider.value = false
      },
    },
  )
}
</script>
