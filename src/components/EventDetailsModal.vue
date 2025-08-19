<template>
  <div
    class="fixed inset-0 z-10 overflow-y-auto"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="$emit('close')"
      ></div>

      <div
        class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
      >
        <div>
          <div class="mt-3 text-center sm:mt-0 sm:text-left">
            <h3
              class="text-base font-semibold leading-6 text-gray-900"
              id="modal-title"
            >
              Détails du rendez-vous
            </h3>

            <div class="mt-6 space-y-4">
              <!-- Client Info -->
              <div class="flex items-center space-x-4">
                <img
                  class="h-12 w-12 rounded-full"
                  :src="event.client.avatar || '/default-avatar.png'"
                  :alt="event.client.name"
                />
                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ event.client.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ event.client.email }}
                  </div>
                </div>
              </div>

              <!-- Service Info -->
              <div>
                <dt class="text-sm font-medium text-gray-500">Service</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ event.service.name }}
                </dd>
                <dd class="text-sm text-gray-500">
                  {{ event.service.description }}
                </dd>
              </div>

              <!-- Date & Time -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Date</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ formatDate(event.date) }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Heure</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ event.time }} - {{ getEndTime(event) }}
                  </dd>
                </div>
              </div>

              <!-- Duration & Price -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Durée</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ event.service.duration }} minutes
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Prix</dt>
                  <dd class="mt-1 text-sm font-medium text-gray-900">
                    {{ event.service.price }}€
                  </dd>
                </div>
              </div>

              <!-- Status -->
              <div>
                <dt class="text-sm font-medium text-gray-500">Statut</dt>
                <dd class="mt-1">
                  <span
                    class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                    :class="getStatusClass(event.status)"
                  >
                    {{ getStatusLabel(event.status) }}
                  </span>
                </dd>
              </div>

              <!-- Notes (if any) -->
              <div v-if="event.notes">
                <dt class="text-sm font-medium text-gray-500">Notes</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ event.notes }}</dd>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex flex-wrap gap-2">
              <button
                v-if="event.status === 'pending'"
                @click="$emit('confirm', event.id)"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <CheckCircleIcon class="h-4 w-4 mr-1" />
                Confirmer
              </button>

              <button
                v-if="event.status === 'confirmed'"
                @click="$emit('complete', event.id)"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <CheckIcon class="h-4 w-4 mr-1" />
                Marquer terminé
              </button>

              <button
                @click="$emit('edit', event)"
                class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PencilIcon class="h-4 w-4 mr-1" />
                Modifier
              </button>

              <button
                v-if="['pending', 'confirmed'].includes(event.status)"
                @click="handleCancel"
                class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <XMarkIcon class="h-4 w-4 mr-1" />
                Annuler
              </button>
            </div>

            <!-- Close button -->
            <div class="mt-6 flex justify-end">
              <button
                type="button"
                @click="$emit('close')"
                class="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  CheckIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

// Props
interface EventProps {
  event: {
    id: number
    client: {
      name: string
      email?: string
      avatar?: string
    }
    service: {
      name: string
      description?: string
      duration: number
      price: number
    }
    date: string
    time: string
    status: string
    notes?: string
  }
}

const props = defineProps<EventProps>()

// Emits
const emit = defineEmits<{
  close: []
  edit: [event: any]
  confirm: [eventId: number]
  complete: [eventId: number]
  cancel: [eventId: number]
}>()

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}

const getEndTime = (event: any) => {
  const [hours, minutes] = event.time.split(':').map(Number)
  const endTime = new Date()
  endTime.setHours(hours, minutes + event.service.duration)
  return endTime.toTimeString().slice(0, 5)
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmé'
    case 'pending':
      return 'En attente'
    case 'cancelled':
      return 'Annulé'
    case 'completed':
      return 'Terminé'
    default:
      return status
  }
}

const handleCancel = () => {
  if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
    emit('cancel', props.event.id)
  }
}
</script>
