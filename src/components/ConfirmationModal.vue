<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>
    <div class="relative w-full max-w-md rounded-lg bg-white shadow-xl">
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </div>
      <div class="px-6 py-4">
        <p class="text-gray-700">{{ message }}</p>
      </div>
      <div class="px-6 py-4 border-t flex items-center justify-end gap-3">
        <button
          type="button"
          class="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          @click="$emit('close')"
        >
          {{ cancelLabel || 'Annuler' }}
        </button>
        <button
          type="button"
          :disabled="pending"
          class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="$emit('confirm')"
        >
          <span v-if="pending">Veuillez patienter...</span>
          <span v-else>{{ confirmLabel || 'Confirmer' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  pending?: boolean
}>()

defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()
</script>
