<template>
  <div
    class="fixed inset-0 z-10 overflow-y-auto"
    aria-labelledby="modal-title"
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
              {{ service ? 'Modifier le service' : 'Ajouter un service' }}
            </h3>
            <div class="mt-4">
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label
                    for="service-name"
                    class="block text-sm font-medium text-gray-700"
                    >Nom du service</label
                  >
                  <input
                    type="text"
                    id="service-name"
                    v-model="formData.name"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Ex: Consultation, Thérapie..."
                  />
                </div>

                <div>
                  <label
                    for="service-description"
                    class="block text-sm font-medium text-gray-700"
                    >Description</label
                  >
                  <textarea
                    id="service-description"
                    v-model="formData.description"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Décrivez brièvement ce service..."
                  ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      for="service-duration"
                      class="block text-sm font-medium text-gray-700"
                      >Durée (minutes)</label
                    >
                    <input
                      type="number"
                      id="service-duration"
                      v-model.number="formData.duration"
                      required
                      min="15"
                      step="15"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="60"
                    />
                  </div>

                  <div>
                    <label
                      for="service-price"
                      class="block text-sm font-medium text-gray-700"
                      >Prix</label
                    >
                    <div class="relative mt-1 rounded-md shadow-sm">
                      <input
                        type="number"
                        id="service-price"
                        v-model.number="formData.price"
                        required
                        min="0"
                        step="0.01"
                        class="block w-full rounded-md border-gray-300 pr-16 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="80.00"
                      />
                      <div
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        <span class="text-gray-500 sm:text-sm">{{
                          formData.currency
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      for="service-currency"
                      class="block text-sm font-medium text-gray-700"
                      >Devise</label
                    >
                    <select
                      id="service-currency"
                      v-model="formData.currency"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="TND">TND</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>

                  <div>
                    <label
                      for="service-status"
                      class="block text-sm font-medium text-gray-700"
                      >Statut</label
                    >
                    <select
                      id="service-status"
                      v-model="formData.status"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </div>
                </div>

                <div
                  class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
                >
                  <button
                    type="submit"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                  >
                    {{ service ? 'Modifier' : 'Ajouter' }}
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
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

// Props
interface ServiceProps {
  service?: {
    id?: string
    name: string
    description: string
    duration: number
    price: number
    currency?: string
    status?: string
  } | null
}

const props = withDefaults(defineProps<ServiceProps>(), {
  service: null,
})

// Emits
const emit = defineEmits<{
  close: []
  save: [
    service: {
      name: string
      description: string
      duration: number
      price: number
      currency: string
      status: string
    },
  ]
}>()

// Form data
const formData = reactive({
  name: '',
  description: '',
  duration: 60,
  price: 0,
  currency: 'TND',
  status: 'active',
})

// Initialize form data
const initializeForm = () => {
  if (props.service) {
    formData.name = props.service.name
    formData.description = props.service.description
    formData.duration = props.service.duration
    formData.price = props.service.price
    formData.currency = props.service.currency || 'TND'
    formData.status = props.service.status || 'active'
  } else {
    formData.name = ''
    formData.description = ''
    formData.duration = 60
    formData.price = 0
    formData.currency = 'TND'
    formData.status = 'active'
  }
}

// Watch for service prop changes
watch(
  () => props.service,
  () => {
    initializeForm()
  },
  { immediate: true },
)

// Methods
const handleSubmit = () => {
  emit('save', {
    name: formData.name,
    description: formData.description,
    duration: formData.duration,
    price: formData.price,
    currency: formData.currency,
    status: formData.status,
  })
}
</script>
