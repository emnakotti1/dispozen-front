<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
  >
    <div class="w-full max-w-lg rounded-lg bg-white shadow-xl">
      <div class="flex items-center justify-between border-b px-6 py-4">
        <h3 class="text-lg font-semibold text-gray-900">
          Modifier le rendez-vous
        </h3>
        <button
          @click="$emit('close')"
          class="rounded p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>

      <div class="px-6 py-4 space-y-4">
        <div class="text-sm text-gray-600">
          <div class="font-medium text-gray-900">
            {{ appointment.service?.name }}
          </div>
          <div>
            Actuel: {{ formatDate(appointment.calendar?.date) }}
            <span v-if="appointment.calendar">
              • {{ appointment.calendar.startTime }} -
              {{ appointment.calendar.endTime }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              for="edit-date"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Date</label
            >
            <input
              type="date"
              v-model="date"
              id="edit-date"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              for="edit-start"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Heure de début</label
            >
            <input
              type="time"
              v-model="startTime"
              id="edit-start"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              step="60"
            />
          </div>
        </div>

        <div>
          <label
            for="edit-notes"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Notes (optionnel)</label
          >
          <textarea
            v-model="notes"
            rows="3"
            id="edit-notes"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Informations supplémentaires pour le prestataire"
          />
        </div>

        <p v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>
      </div>

      <div class="flex items-center justify-end gap-3 border-t px-6 py-4">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Annuler
        </button>
        <button
          @click="onSave"
          :disabled="pending || !isValid"
          class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="pending">Enregistrement...</span>
          <span v-else>Enregistrer</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface AppointmentLite {
  id: string
  service?: { name?: string; duration?: number }
  calendar?: { date?: string; startTime?: string; endTime?: string } | null
}

const props = defineProps<{
  open: boolean
  appointment: AppointmentLite
  pending?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (
    e: 'save',
    payload: {
      date: string
      startTime: string
      endTime?: string
      notes?: string
    },
  ): void
}>()

const date = ref<string>('')
const startTime = ref<string>('')
const notes = ref<string>('')
const errorMessage = ref('')

watch(
  () => props.open,
  open => {
    if (open) {
      date.value = props.appointment.calendar?.date || ''
      startTime.value = (props.appointment.calendar?.startTime || '').slice(
        0,
        5,
      )
      notes.value = ''
      errorMessage.value = ''
    }
  },
  { immediate: true },
)

const isValid = computed(() => !!date.value && !!startTime.value)

function addMinutesToTime(timeHHMM: string, minutes: number): string {
  const [h, m] = timeHHMM.split(':').map(Number)
  const base = new Date(0, 0, 0, h || 0, m || 0, 0)
  base.setMinutes(base.getMinutes() + (minutes || 0))
  const hh = String(base.getHours()).padStart(2, '0')
  const mm = String(base.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function onSave() {
  if (!isValid.value) {
    errorMessage.value = "Veuillez renseigner la date et l'heure."
    return
  }
  const duration = props.appointment.service?.duration || 0
  const end =
    duration > 0 ? addMinutesToTime(startTime.value, duration) : undefined
  emit('save', {
    date: date.value,
    startTime: `${startTime.value}:00`,
    endTime: end ? `${end}:00` : undefined,
    notes: notes.value || undefined,
  })
}

function formatDate(d?: string) {
  if (!d) return 'Date non définie'
  try {
    return new Date(d).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return d
  }
}
</script>
