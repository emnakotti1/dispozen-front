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
        class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
      >
        <div>
          <div class="mt-3 text-center sm:mt-0 sm:text-left">
            <h3
              class="text-base font-semibold leading-6 text-gray-900"
              id="modal-title"
            >
              {{
                appointment ? 'Modifier le rendez-vous' : 'Créer un rendez-vous'
              }}
            </h3>

            <form @submit.prevent="handleSubmit" class="mt-6 space-y-6">
              <!-- Client Selection -->
              <div>
                <label
                  for="client"
                  class="block text-sm font-medium text-gray-700"
                  >Client</label
                >
                <select
                  id="client"
                  v-model="formData.clientId"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Sélectionner un client</option>
                  <option
                    v-for="client in clients"
                    :key="client.id"
                    :value="client.id"
                  >
                    {{ client.name }} - {{ client.email }}
                  </option>
                </select>
              </div>

              <!-- Service Selection -->
              <div>
                <label
                  for="service"
                  class="block text-sm font-medium text-gray-700"
                  >Service</label
                >
                <select
                  id="service"
                  v-model="formData.serviceId"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Sélectionner un service</option>
                  <option
                    v-for="service in services"
                    :key="service.id"
                    :value="service.id"
                  >
                    {{ service.name }} - {{ service.duration }}min -
                    {{ service.price }}€
                  </option>
                </select>
              </div>

              <!-- Date and Time -->
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    for="date"
                    class="block text-sm font-medium text-gray-700"
                    >Date</label
                  >
                  <input
                    type="date"
                    id="date"
                    v-model="formData.date"
                    required
                    :min="today"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    for="time"
                    class="block text-sm font-medium text-gray-700"
                    >Heure</label
                  >
                  <select
                    id="time"
                    v-model="formData.time"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Sélectionner une heure</option>
                    <option
                      v-for="timeSlot in availableTimeSlots"
                      :key="timeSlot"
                      :value="timeSlot"
                    >
                      {{ timeSlot }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Status -->
              <div>
                <label
                  for="status"
                  class="block text-sm font-medium text-gray-700"
                  >Statut</label
                >
                <select
                  id="status"
                  v-model="formData.status"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="cancelled">Annulé</option>
                  <option value="completed">Terminé</option>
                </select>
              </div>

              <!-- Notes -->
              <div>
                <label
                  for="notes"
                  class="block text-sm font-medium text-gray-700"
                  >Notes (optionnel)</label
                >
                <textarea
                  id="notes"
                  v-model="formData.notes"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Notes ou commentaires sur le rendez-vous..."
                ></textarea>
              </div>

              <!-- Selected Service Info -->
              <div v-if="selectedService" class="bg-gray-50 p-4 rounded-lg">
                <h4 class="text-sm font-medium text-gray-900 mb-2">
                  Détails du service sélectionné
                </h4>
                <div class="text-sm text-gray-600 space-y-1">
                  <p>
                    <span class="font-medium">Service:</span>
                    {{ selectedService.name }}
                  </p>
                  <p>
                    <span class="font-medium">Description:</span>
                    {{ selectedService.description }}
                  </p>
                  <p>
                    <span class="font-medium">Durée:</span>
                    {{ selectedService.duration }} minutes
                  </p>
                  <p>
                    <span class="font-medium">Prix:</span>
                    {{ selectedService.price }}€
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div
                class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
              >
                <button
                  type="submit"
                  :disabled="!isFormValid"
                  class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ appointment ? 'Modifier' : 'Créer' }}
                </button>
                <button
                  type="button"
                  @click="$emit('close')"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'

// Props
interface AppointmentProps {
  appointment?: {
    id: number
    client: any
    service: any
    date: string
    time: string
    status: string
    notes?: string
  } | null
}

const props = withDefaults(defineProps<AppointmentProps>(), {
  appointment: null,
})

// Emits
const emit = defineEmits<{
  close: []
  save: [appointment: any]
}>()

// State
const clients = ref([
  { id: 1, name: 'Marie Dubois', email: 'marie.dubois@email.com' },
  { id: 2, name: 'Pierre Martin', email: 'pierre.martin@email.com' },
  { id: 3, name: 'Sophie Laurent', email: 'sophie.laurent@email.com' },
])

const services = ref([
  {
    id: 1,
    name: 'Consultation initiale',
    description: 'Première consultation',
    duration: 60,
    price: 80,
  },
  {
    id: 2,
    name: 'Suivi régulier',
    description: 'Séance de suivi',
    duration: 45,
    price: 60,
  },
  {
    id: 3,
    name: 'Thérapie spécialisée',
    description: 'Thérapie spécialisée',
    duration: 90,
    price: 120,
  },
])

// Form data
const formData = reactive({
  clientId: '',
  serviceId: '',
  date: '',
  time: '',
  status: 'pending',
  notes: '',
})

// Computed
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const selectedService = computed(() => {
  return services.value.find(s => s.id === parseInt(formData.serviceId))
})

const selectedClient = computed(() => {
  return clients.value.find(c => c.id === parseInt(formData.clientId))
})

const availableTimeSlots = computed(() => {
  // Generate time slots from 8:00 to 18:00 (every 30 minutes)
  const slots = []
  for (let hour = 8; hour <= 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    if (hour < 18) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
  }
  return slots
})

const isFormValid = computed(() => {
  return (
    formData.clientId && formData.serviceId && formData.date && formData.time
  )
})

// Methods
const initializeForm = () => {
  if (props.appointment) {
    formData.clientId = props.appointment.client.id?.toString() || ''
    formData.serviceId = props.appointment.service.id?.toString() || ''
    formData.date = props.appointment.date
    formData.time = props.appointment.time
    formData.status = props.appointment.status
    formData.notes = props.appointment.notes || ''
  } else {
    formData.clientId = ''
    formData.serviceId = ''
    formData.date = ''
    formData.time = ''
    formData.status = 'pending'
    formData.notes = ''
  }
}

const handleSubmit = () => {
  if (!isFormValid.value) return

  const client = selectedClient.value
  const service = selectedService.value

  if (!client || !service) return

  const appointmentData = {
    client,
    service,
    date: formData.date,
    time: formData.time,
    datetime: `${formData.date}T${formData.time}`,
    status: formData.status,
    notes: formData.notes,
  }

  emit('save', appointmentData)
}

// Watchers
watch(
  () => props.appointment,
  () => {
    initializeForm()
  },
  { immediate: true },
)

// Load data on mount
onMounted(() => {
  // Load clients and services from API
  // loadClients()
  // loadServices()
})
</script>
