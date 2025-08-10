<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="border-b border-gray-200 pb-5">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Gestion des réservations
          </h3>
          <p class="mt-2 max-w-4xl text-sm text-gray-500">
            Gérez tous vos rendez-vous et réservations
          </p>
        </div>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Créer un rendez-vous
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label
            for="status-filter"
            class="block text-sm font-medium text-gray-700"
            >Statut</label
          >
          <select
            id="status-filter"
            v-model="filters.status"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Tous les statuts</option>
            <option value="confirmed">Confirmé</option>
            <option value="pending">En attente</option>
            <option value="cancelled">Annulé</option>
            <option value="completed">Terminé</option>
          </select>
        </div>
        <div>
          <label for="date-from" class="block text-sm font-medium text-gray-700"
            >Du</label
          >
          <input
            type="date"
            id="date-from"
            v-model="filters.dateFrom"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="date-to" class="block text-sm font-medium text-gray-700"
            >Au</label
          >
          <input
            type="date"
            id="date-to"
            v-model="filters.dateTo"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>

    <!-- Appointments List -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-4 py-5 sm:p-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-8">
          <div
            class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white"
          >
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
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
            Chargement des rendez-vous...
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="isError" class="text-center py-8">
          <div class="text-red-600">
            <h3 class="text-lg font-medium">Erreur de chargement</h3>
            <p class="mt-2 text-sm">
              Impossible de charger les rendez-vous. Veuillez réessayer.
            </p>
            <button
              @click="refetch()"
              class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>

        <!-- Appointments Table -->
        <div v-else class="flow-root">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
            >
              <table class="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      class="py-3.5 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0"
                    >
                      Client
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Service
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Date & Heure
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Durée
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Statut
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Prix
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="appointment in filteredAppointments"
                    :key="appointment.id"
                    class="hover:bg-gray-50"
                  >
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-0">
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                          <div
                            class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                          >
                            <span class="text-sm font-medium text-gray-700">
                              {{ appointment.client.firstName?.[0]
                              }}{{ appointment.client.lastName?.[0] }}
                            </span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ appointment.client.firstName }}
                            {{ appointment.client.lastName }}
                          </div>
                          <div class="text-sm text-gray-500">
                            {{ appointment.client.email }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      <div class="text-gray-900">
                        {{ appointment.service.name }}
                      </div>
                      <div class="text-gray-500">
                        {{ appointment.service.description }}
                      </div>
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      <div class="text-gray-900">
                        {{
                          appointment.calendar?.date
                            ? formatDate(appointment.calendar.date)
                            : 'Non programmé'
                        }}
                      </div>
                      <div class="text-gray-500">
                        {{
                          appointment.calendar?.startTime || 'Heure non définie'
                        }}
                      </div>
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {{ appointment.service.duration }} min
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      <span
                        class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                        :class="getStatusClass(appointment.status)"
                      >
                        {{ getStatusLabel(appointment.status) }}
                      </span>
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900"
                    >
                      {{ appointment.service.price }}€
                    </td>
                    <td
                      class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                    >
                      <div class="flex items-center justify-end space-x-2">
                        <button
                          v-if="appointment.status === 'pending'"
                          @click="confirmAppointment(appointment.id)"
                          :disabled="isConfirmingAppointment"
                          class="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          <span v-if="isConfirmingAppointment"
                            >Confirmation...</span
                          >
                          <span v-else>Confirmer</span>
                        </button>
                        <button
                          v-if="
                            ['pending', 'confirmed'].includes(
                              appointment.status,
                            )
                          "
                          @click="cancelAppointment(appointment.id)"
                          :disabled="isLoadingCancel.value"
                          class="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          <span v-if="isLoadingCancel.value"
                            >Annulation...</span
                          >
                          <span v-else>Annuler</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                v-if="filteredAppointments.length === 0"
                class="text-center py-8"
              >
                <CalendarDaysIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">
                  Aucun rendez-vous
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Aucun rendez-vous trouvé avec les filtres sélectionnés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
    >
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Précédent
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Affichage de
            <span class="font-medium">{{
              (currentPage - 1) * itemsPerPage + 1
            }}</span>
            à
            <span class="font-medium">{{
              Math.min(currentPage * itemsPerPage, totalItems)
            }}</span>
            sur
            <span class="font-medium">{{ totalItems }}</span>
            résultats
          </p>
        </div>
        <div>
          <nav
            class="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span class="sr-only">Précédent</span>
              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                page === currentPage
                  ? 'relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
              ]"
            >
              {{ page }}
            </button>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span class="sr-only">Suivant</span>
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Create/Edit Appointment Modal -->
    <AppointmentModal
      v-if="showCreateModal || editingAppointment"
      :appointment="editingAppointment"
      @close="closeModal"
      @save="saveAppointment"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  PlusIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import AppointmentModal from '../../components/AppointmentModal.vue'
import {
  useProviderAppointments,
  useConfirmAppointment,
  useCancelAppointment,
} from '../../hooksQuerie/appointments'
import { useAuth } from '../../composables/useAuth'

// State
const showCreateModal = ref(false)
const editingAppointment = ref<any>(null)
const currentPage = ref(1)
const itemsPerPage = 10

// Get current user to fetch provider's appointments
const { currentUser } = useAuth()

// Fetch provider appointments
const {
  appointments: providerAppointments,
  isLoading,
  isError,
  refetch,
} = useProviderAppointments(currentUser.value?.id || '')

// Confirm appointment functionality
const {
  confirmAppointment: confirmAppointmentAPI,
  isLoading: isConfirmingAppointment,
} = useConfirmAppointment()

// Cancel appointment functionality
const { cancelAppointment: cancelAppointmentAPI, isLoading: isLoadingCancel } =
  useCancelAppointment()

// Filters
const filters = reactive({
  status: '',
  dateFrom: '',
  dateTo: '',
})

// Use real appointments data from API
const appointments = computed(() => providerAppointments.value || [])

// Computed
const filteredAppointments = computed(() => {
  let filtered = appointments.value

  if (filters.status) {
    filtered = filtered.filter(apt => apt.status === filters.status)
  }

  if (filters.dateFrom) {
    filtered = filtered.filter(
      apt => apt.calendar?.date && apt.calendar.date >= filters.dateFrom,
    )
  }

  if (filters.dateTo) {
    filtered = filtered.filter(
      apt => apt.calendar?.date && apt.calendar.date <= filters.dateTo,
    )
  }

  return filtered
})

const totalItems = computed(() => filteredAppointments.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
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

const resetFilters = () => {
  filters.status = ''
  filters.dateFrom = ''
  filters.dateTo = ''
  currentPage.value = 1
}

const confirmAppointment = async (appointmentId: string) => {
  try {
    console.log('🔄 Confirmation du rendez-vous:', appointmentId)
    await confirmAppointmentAPI(appointmentId)
    console.log('✅ Rendez-vous confirmé avec succès')
    // The hook will automatically refresh the data via invalidateQueries
  } catch (error) {
    console.error('❌ Erreur lors de la confirmation:', error)
  }
}

const cancelAppointment = async (appointmentId: string) => {
  if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
    try {
      console.log('🔄 Annulation du rendez-vous:', appointmentId)
      await cancelAppointmentAPI(appointmentId)
      console.log('✅ Rendez-vous annulé avec succès')
      // The hook will automatically refresh the data via invalidateQueries
    } catch (error) {
      console.error("❌ Erreur lors de l'annulation:", error)
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingAppointment.value = null
}

const saveAppointment = (appointmentData: any) => {
  if (editingAppointment.value) {
    // Update existing appointment
    const index = appointments.value.findIndex(
      apt => apt.id === editingAppointment.value!.id,
    )
    if (index !== -1) {
      appointments.value[index] = {
        ...appointmentData,
        id: editingAppointment.value!.id,
      }
    }
  } else {
    // Add new appointment
    const newAppointment = {
      ...appointmentData,
      id: Date.now(), // Simple ID generation
    }
    appointments.value.push(newAppointment)
  }
  closeModal()
}

// Pagination
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

// Load data on mount
onMounted(() => {
  // Load appointments from API
  // loadAppointments()
})
</script>
