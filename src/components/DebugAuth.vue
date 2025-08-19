<template>
  <div
    class="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-lg text-xs max-w-sm"
  >
    <h4 class="font-bold mb-2">🔍 Debug Auth</h4>
    <div class="space-y-1">
      <div><strong>Token localStorage:</strong> {{ !!tokenInStorage }}</div>
      <div><strong>User localStorage:</strong> {{ !!userInStorage }}</div>
      <div><strong>isAuthenticated:</strong> {{ isAuthenticated }}</div>
      <div>
        <strong>currentUser:</strong> {{ currentUser?.email || 'null' }}
      </div>
      <div><strong>Route actuelle:</strong> {{ $route.path }}</div>
      <div v-if="tokenPayload" class="mt-2">
        <strong>Token décodé:</strong>
        <div class="text-xs">Email: {{ tokenPayload.email }}</div>
        <div class="text-xs">Sub: {{ tokenPayload.sub }}</div>
        <div class="text-xs">Role: {{ tokenPayload.role }}</div>
        <div class="text-xs">
          Exp: {{ new Date(tokenPayload.exp * 1000).toLocaleString() }}
        </div>
      </div>
    </div>
    <button @click="clearAll" class="mt-2 px-2 py-1 bg-red-600 rounded text-xs">
      Clear All
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

const { isAuthenticated, currentUser, logout } = useAuth()

const tokenInStorage = ref(false)
const userInStorage = ref(false)
const tokenPayload = ref<any>(null)

const updateDebugInfo = () => {
  tokenInStorage.value = !!localStorage.getItem('accessToken')
  userInStorage.value = !!localStorage.getItem('userData')

  const token = localStorage.getItem('accessToken')
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      tokenPayload.value = payload
    } catch (error) {
      tokenPayload.value = null
    }
  } else {
    tokenPayload.value = null
  }
}

const clearAll = () => {
  logout()
  updateDebugInfo()
}

onMounted(() => {
  updateDebugInfo()

  // Mettre à jour les infos toutes les secondes
  setInterval(updateDebugInfo, 1000)
})
</script>
