<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Test de mise à jour utilisateur</h2>

    <div class="bg-white shadow rounded-lg p-6">
      <h3 class="text-lg font-medium mb-4">Utilisateur actuel (Auth)</h3>
      <pre class="bg-gray-100 p-4 rounded text-sm">{{
        JSON.stringify(currentUser, null, 2)
      }}</pre>

      <h3 class="text-lg font-medium mb-4 mt-6">
        Données utilisateur (API GET /users/:id)
      </h3>
      <div v-if="isLoadingProfile" class="text-center py-4">
        <div
          class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"
        ></div>
        <p class="mt-2 text-sm text-gray-500">Chargement...</p>
      </div>
      <div v-else-if="isErrorProfile" class="text-center py-4">
        <p class="text-sm text-red-600">Erreur lors du chargement</p>
        <button
          @click="() => refetchProfile()"
          class="mt-2 text-sm text-indigo-600"
        >
          Réessayer
        </button>
      </div>
      <pre v-else class="bg-blue-50 p-4 rounded text-sm">{{
        JSON.stringify(userProfile, null, 2)
      }}</pre>

      <form @submit.prevent="testUpdate" class="mt-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Prénom</label>
          <input
            type="text"
            v-model="testForm.firstName"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            v-model="testForm.lastName"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            v-model="testForm.email"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Téléphone</label
          >
          <input
            type="tel"
            v-model="testForm.phoneNumber"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Biographie</label
          >
          <textarea
            v-model="testForm.biography"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Décrivez votre expérience et vos spécialités..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Adresse</label>
          <textarea
            v-model="testForm.address"
            rows="2"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Code postal</label
            >
            <input
              type="text"
              v-model="testForm.postalCode"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Ville</label>
            <input
              type="text"
              v-model="testForm.city"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >URL de l'image</label
          >
          <input
            type="url"
            v-model="testForm.imageUrl"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="https://exemple.com/photo.jpg"
          />
        </div>

        <button
          type="submit"
          :disabled="isPending"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          <span v-if="isPending">Mise à jour...</span>
          <span v-else>Tester l'endpoint PUT /users/:id</span>
        </button>
      </form>

      <div v-if="result" class="mt-6">
        <h4 class="text-lg font-medium text-green-600">Résultat :</h4>
        <pre class="bg-green-50 p-4 rounded text-sm mt-2">{{
          JSON.stringify(result, null, 2)
        }}</pre>
      </div>

      <div v-if="error" class="mt-6">
        <h4 class="text-lg font-medium text-red-600">Erreur :</h4>
        <pre class="bg-red-50 p-4 rounded text-sm mt-2">{{ error }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useUpdateUserMutation, useUserByIdQuery } from '../hooksQuerie/users'

const { currentUser } = useAuth()
const { mutate: updateUser, isPending } = useUpdateUserMutation()
const {
  data: userProfile,
  isLoading: isLoadingProfile,
  isError: isErrorProfile,
  refetch: refetchProfile,
} = useUserByIdQuery(currentUser.value?.id || '')

const testForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  biography: '',
  address: '',
  postalCode: '',
  city: '',
  imageUrl: '',
})

const result = ref<any>(null)
const error = ref<string | null>(null)

// Initialize form with user profile data from API
watch(
  userProfile,
  profile => {
    if (profile) {
      testForm.firstName = profile.firstName || ''
      testForm.lastName = profile.lastName || ''
      testForm.email = profile.email || ''
      testForm.phoneNumber = profile.phoneNumber || ''
      testForm.biography = profile.biography || ''
      testForm.address = profile.address || ''
      testForm.postalCode = profile.postalCode || ''
      testForm.city = profile.city || ''
      testForm.imageUrl = profile.imageUrl || ''
    }
  },
  { immediate: true },
)

// Fallback: initialize with current user data if API data not available
watch(
  currentUser,
  user => {
    if (user && !userProfile.value) {
      testForm.firstName = user.firstname || ''
      testForm.lastName = user.lastname || ''
      testForm.email = user.email || ''
      testForm.phoneNumber = ''
    }
  },
  { immediate: true },
)

const testUpdate = () => {
  if (!currentUser.value?.id) {
    error.value = 'Aucun utilisateur connecté'
    return
  }

  error.value = null
  result.value = null

  updateUser(
    {
      id: currentUser.value.id,
      userData: { ...testForm },
    },
    {
      onSuccess: data => {
        result.value = data
      },
      onError: err => {
        error.value = err.message || 'Erreur inconnue'
        console.error("❌ Erreur lors du test de l'endpoint:", err)
      },
    },
  )
}
</script>
