<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="border-b border-gray-200 pb-5">
      <h3 class="text-lg font-medium leading-6 text-gray-900">
        Gestion du profil
      </h3>
      <p class="mt-2 max-w-4xl text-sm text-gray-500">
        Gérez vos informations personnelles et vos services
      </p>
    </div>

    <!-- Profile Information -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-gray-900 mb-4">
          Informations personnelles
        </h3>

        <!-- Loading state for user profile -->
        <div v-if="isLoadingUser" class="text-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"
          ></div>
          <p class="mt-2 text-sm text-gray-500">
            Chargement des informations...
          </p>
        </div>

        <!-- Error state for user profile -->
        <div v-else-if="isErrorUser" class="text-center py-8">
          <p class="text-sm text-red-600">
            Erreur lors du chargement des informations personnelles
          </p>
          <button
            @click="() => refetchUser()"
            class="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Réessayer
          </button>
        </div>

        <!-- Profile form -->
        <form v-else @submit.prevent="updateProfile" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                for="firstname"
                class="block text-sm font-medium text-gray-700"
                >Prénom</label
              >
              <input
                type="text"
                id="firstname"
                v-model="profileForm.firstname"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                for="lastname"
                class="block text-sm font-medium text-gray-700"
                >Nom</label
              >
              <input
                type="text"
                id="lastname"
                v-model="profileForm.lastname"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"
                >Email</label
              >
              <input
                type="email"
                id="email"
                v-model="profileForm.email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700"
                >Téléphone</label
              >
              <input
                type="tel"
                id="phone"
                v-model="profileForm.phone"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="bio" class="block text-sm font-medium text-gray-700"
              >Biographie</label
            >
            <textarea
              id="bio"
              v-model="profileForm.bio"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Décrivez votre expérience et vos spécialités..."
            ></textarea>
          </div>

          <div>
            <p class="block text-sm font-medium text-gray-700 mb-2">
              Localisation
            </p>
            <AddressMap
              ref="addressMapRef"
              v-model="profileForm.address"
              v-model:postal-code="profileForm.postalCode"
              v-model:city="profileForm.city"
              v-model:governorate="profileForm.governorate"
              @coordinates-updated="onCoordinatesUpdated"
            />
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label
                for="postalCode"
                class="block text-sm font-medium text-gray-700"
                >Code postal</label
              >
              <input
                type="text"
                id="postalCode"
                v-model="profileForm.postalCode"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700"
                >Ville</label
              >
              <input
                type="text"
                id="city"
                v-model="profileForm.city"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                for="governorate"
                class="block text-sm font-medium text-gray-700"
                >Gouvernorat</label
              >
              <input
                type="text"
                id="governorate"
                v-model="profileForm.governorate"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Département/Région"
              />
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="isUpdatingUser"
              class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <span v-if="isUpdatingUser">Mise à jour...</span>
              <span v-else>Mettre à jour</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Appointments Overview -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-gray-900 mb-4">
          Mes rendez-vous
        </h3>

        <div v-if="appointmentsLoading" class="text-center py-4">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"
          ></div>
          <p class="mt-2 text-sm text-gray-500">
            Chargement des rendez-vous...
          </p>
        </div>

        <div v-else-if="appointmentsError" class="text-center py-4">
          <p class="text-sm text-red-600">
            Erreur lors du chargement des rendez-vous
          </p>
          <button
            @click="() => refetchAppointments()"
            class="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Réessayer
          </button>
        </div>

        <div
          v-else-if="appointments && appointments.length > 0"
          class="space-y-4"
        >
          <div
            v-for="appointment in appointments.slice(0, 5)"
            :key="appointment.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">
                  {{ appointment.service?.name || 'Service non spécifié' }}
                </h4>
                <p class="text-sm text-gray-500">
                  Client: {{ appointment.client?.firstName }}
                  {{ appointment.client?.lastName }}
                </p>
                <p class="text-sm text-gray-500">
                  {{
                    appointment.calendar
                      ? new Date(
                          appointment.calendar.date +
                            ' ' +
                            appointment.calendar.startTime,
                        ).toLocaleString('fr-FR')
                      : 'Date non définie'
                  }}
                </p>
              </div>
              <div class="flex flex-col items-end space-y-2">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    appointment.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : appointment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : appointment.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{
                    appointment.status === 'confirmed'
                      ? 'Confirmé'
                      : appointment.status === 'pending'
                      ? 'En attente'
                      : appointment.status === 'cancelled'
                      ? 'Annulé'
                      : appointment.status
                  }}
                </span>
                <p class="text-sm text-gray-900">
                  {{ appointment.service?.price }}€
                </p>
                <button
                  v-if="appointment.status === 'pending'"
                  @click="
                    () => {
                      console.log(
                        '🖱️ Clic détecté sur bouton confirmer pour:',
                        appointment.id,
                      )
                      console.log(
                        '🔍 Status de l\'appointment:',
                        appointment.status,
                      )
                      handleConfirmAppointment(appointment.id)
                    }
                  "
                  :disabled="isConfirmingAppointment"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded border border-green-300 text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <span v-if="isConfirmingAppointment">Confirmation...</span>
                  <span v-else>Confirmer</span>
                </button>
                <!-- Debug: Show if button should be visible -->
                {{
                  console.log(
                    '👁️ Bouton visible pour appointment:',
                    appointment.id,
                    'Status:',
                    appointment.status,
                    'Should show:',
                    appointment.status === 'pending',
                  )
                }}
              </div>
            </div>
          </div>

          <div
            v-if="appointments.length > 5"
            class="text-center pt-4 border-t border-gray-200"
          >
            <p class="text-sm text-gray-500">
              {{ appointments.length - 5 }} autre(s) rendez-vous...
            </p>
            <router-link
              to="/provider/appointments"
              class="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Voir tous les rendez-vous
            </router-link>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <ClockIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            Aucun rendez-vous
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Vous n'avez pas encore de rendez-vous programmés.
          </p>
        </div>
      </div>
    </div>

    <!-- Services Management -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold leading-6 text-gray-900">
            Mes services
          </h3>
          <button
            @click="showAddServiceModal = true"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Ajouter un service
          </button>
        </div>

        <div class="grid gap-4">
          <!-- Loading State -->
          <div v-if="servicesLoading" class="text-center py-8">
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
              Chargement des services...
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="servicesError" class="text-center py-8">
            <div class="text-red-600">
              <h3 class="text-lg font-medium">Erreur de chargement</h3>
              <p class="mt-2 text-sm">
                Impossible de charger les services. Veuillez réessayer.
              </p>
              <button
                @click="refetchServices()"
                class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          </div>

          <!-- Services List -->
          <div
            v-else
            v-for="service in services"
            :key="service.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900">
                  {{ service.name }}
                </h4>
                <p class="text-sm text-gray-500 mt-1">
                  {{ service.description }}
                </p>
                <div class="flex items-center mt-2 space-x-4">
                  <span class="text-sm text-gray-500">
                    <ClockIcon class="inline h-4 w-4 mr-1" />
                    {{ service.duration }} min
                  </span>
                  <span class="text-sm font-medium text-green-600"
                    >{{ service.price }}€</span
                  >
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="editService(service)"
                  class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  Modifier
                </button>
                <button
                  @click="cancelService(service.id)"
                  class="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="
              !servicesLoading &&
              !servicesError &&
              (!services || services.length === 0)
            "
            class="text-center py-8"
          >
            <div class="text-gray-500">
              <ClockIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">
                Aucun service
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                Commencez par ajouter votre premier service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Working Hours -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-gray-900 mb-4">
          Horaires de travail
        </h3>

        <div class="space-y-4">
          <div
            v-for="(day, index) in workingHours"
            :key="day.day"
            class="flex items-center justify-between py-2"
          >
            <div class="flex items-center">
              <input
                :id="`working-${day.day}`"
                type="checkbox"
                v-model="day.isWorking"
                @change="toggleDayWorking(index)"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                :for="`working-${day.day}`"
                class="ml-3 text-sm font-medium text-gray-700 min-w-[80px]"
              >
                {{ day.label }}
              </label>
            </div>

            <div class="flex items-center space-x-2">
              <input
                type="time"
                v-model="day.startTime"
                :disabled="!day.isWorking"
                :class="[
                  'block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
                  !day.isWorking ? 'bg-gray-100 text-gray-400' : '',
                ]"
              />
              <span class="text-gray-500">à</span>
              <input
                type="time"
                v-model="day.endTime"
                :disabled="!day.isWorking"
                :class="[
                  'block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
                  !day.isWorking ? 'bg-gray-100 text-gray-400' : '',
                ]"
              />
              <span v-if="!day.isWorking" class="text-sm text-red-500 ml-2"
                >Fermé</span
              >
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="updateWorkingHours"
            :disabled="isUpdatingHours"
            class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <span v-if="isUpdatingHours">Mise à jour...</span>
            <span v-else>Mettre à jour les horaires</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Service Modal -->
    <ServiceModal
      v-if="showAddServiceModal || editingService"
      :service="editingService"
      @close="closeServiceModal"
      @save="saveService"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { PlusIcon, ClockIcon } from '@heroicons/vue/24/outline'
import ServiceModal from '../../components/ServiceModal.vue'
import AddressMap from '../../components/AddressMap.vue'
import {
  useProviderServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from '../../hooksQuerie/services'
import {
  useProviderAppointments,
  useConfirmAppointment,
} from '../../hooksQuerie/appointments'
import {
  useMyWorkingHours,
  useUpdateMyWorkingHours,
  getDayLabel,
} from '../../hooksQuerie/workingHours'
import {
  useUpdateUserMutation,
  useUserByIdQuery,
} from '../../hooksQuerie/users'

// Composables
const { currentUser } = useAuth()

// Référence vers le composant AddressMap
const addressMapRef = ref<any>(null)

// User queries and mutations
const {
  data: userProfile,
  isLoading: isLoadingUser,
  isError: isErrorUser,
  refetch: refetchUser,
} = useUserByIdQuery(currentUser.value?.id || '')
const { mutate: updateUserMutation, isPending: isUpdatingUser } =
  useUpdateUserMutation()

// State
const isUpdatingHours = ref(false)
const showAddServiceModal = ref(false)
const editingService = ref<any>(null)

// Profile form
const profileForm = reactive({
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  bio: '',
  address: '',
  postalCode: '',
  city: '',
  governorate: '',
  imageUrl: '',
})

// Watch for user profile changes from API to update form
watch(
  userProfile,
  newProfile => {
    if (newProfile) {
      profileForm.firstname = newProfile.firstName || ''
      profileForm.lastname = newProfile.lastName || ''
      profileForm.email = newProfile.email || ''
      profileForm.phone = newProfile.phoneNumber || ''
      profileForm.bio = newProfile.biography || ''
      profileForm.address = newProfile.address || ''
      profileForm.postalCode = newProfile.postalCode || ''
      profileForm.city = newProfile.city || ''
      profileForm.governorate = newProfile.governorate || ''
      profileForm.imageUrl = newProfile.imageUrl || ''

      // Forcer le géocodage de l'adresse après un délai
      if (newProfile.address && addressMapRef.value) {
        console.log('Forçage du géocodage pour:', newProfile.address)
        setTimeout(() => {
          addressMapRef.value?.forceGeocodeAddress(newProfile.address)
        }, 1000)
      }
    }
  },
  { immediate: true },
)

// Fallback: watch for currentUser changes if userProfile is not loaded yet
watch(
  currentUser,
  newUser => {
    if (newUser && !userProfile.value) {
      profileForm.firstname = newUser.firstname || ''
      profileForm.lastname = newUser.lastname || ''
      profileForm.email = newUser.email || ''
    }
  },
  { immediate: true },
)

// Real services data from API
const {
  services,
  isLoading: servicesLoading,
  isError: servicesError,
  refetch: refetchServices,
} = useProviderServices(currentUser.value?.id || '')

// Service mutations
const { createService: createServiceMutation } = useCreateService()
const { updateService: updateServiceMutation } = useUpdateService()
const { cancelService } = useDeleteService()

// Provider appointments data from API
const {
  appointments,
  isLoading: appointmentsLoading,
  isError: appointmentsError,
  refetch: refetchAppointments,
} = useProviderAppointments(currentUser.value?.id || '')

// Confirm appointment functionality
const { confirmAppointment, isLoading: isConfirmingAppointment } =
  useConfirmAppointment()

// Working hours - real data from API
const { workingHours: apiWorkingHours } = useMyWorkingHours()
const { updateWorkingHours: updateWorkingHoursMutation } =
  useUpdateMyWorkingHours()

// Create a reactive ref for working hours
const workingHours = ref([
  {
    day: 'monday',
    label: 'Lundi',
    isWorking: true,
    startTime: '09:00',
    endTime: '17:00',
  },
  {
    day: 'tuesday',
    label: 'Mardi',
    isWorking: true,
    startTime: '09:00',
    endTime: '17:00',
  },
  {
    day: 'wednesday',
    label: 'Mercredi',
    isWorking: true,
    startTime: '09:00',
    endTime: '17:00',
  },
  {
    day: 'thursday',
    label: 'Jeudi',
    isWorking: true,
    startTime: '09:00',
    endTime: '17:00',
  },
  {
    day: 'friday',
    label: 'Vendredi',
    isWorking: true,
    startTime: '09:00',
    endTime: '17:00',
  },
  {
    day: 'saturday',
    label: 'Samedi',
    isWorking: false,
    startTime: '09:00',
    endTime: '17:00',
  },
  {
    day: 'sunday',
    label: 'Dimanche',
    isWorking: false,
    startTime: '09:00',
    endTime: '17:00',
  },
])

// Watch for API data changes and update local ref
watch(
  apiWorkingHours,
  newData => {
    if (newData && newData.length > 0) {
      workingHours.value = newData.map(item => ({
        day: item.dayOfWeek,
        label: getDayLabel(item.dayOfWeek),
        isWorking: !item.isClosed,
        startTime: item.startTime || '09:00',
        endTime: item.endTime || '17:00',
      }))
    }
  },
  { immediate: true },
)

// Methods
const onCoordinatesUpdated = (coordinates: { lat: number; lng: number }) => {
  console.log('Coordonnées mises à jour:', coordinates)
  // Vous pouvez sauvegarder les coordonnées si nécessaire
  // Par exemple dans le profil utilisateur ou dans une base de données séparée
}

const updateProfile = async () => {
  if (!currentUser.value?.id) {
    console.error('User ID not found')
    return
  }

  try {
    // Prepare user data for API
    const userData = {
      firstName: profileForm.firstname,
      lastName: profileForm.lastname,
      email: profileForm.email,
      phoneNumber: profileForm.phone,
      biography: profileForm.bio,
      address: profileForm.address,
      postalCode: profileForm.postalCode,
      city: profileForm.city,
      governorate: profileForm.governorate,
      imageUrl: profileForm.imageUrl,
    }

    // Call API to update user
    updateUserMutation(
      {
        id: currentUser.value.id,
        userData,
      },
      {
        onSuccess: () => {
          console.log('✅ Profil mis à jour avec succès')
          // Reload user profile data from API
          refetchUser()
        },
        onError: error => {
          console.error('❌ Erreur lors de la mise à jour du profil:', error)
        },
      },
    )
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}

const updateWorkingHours = async () => {
  isUpdatingHours.value = true
  try {
    // Transform local format back to API format
    const workingHoursData = workingHours.value.map(item => ({
      dayOfWeek: item.day as any, // Cast to DayOfWeek enum
      isClosed: !item.isWorking,
      startTime: item.isWorking ? item.startTime : null,
      endTime: item.isWorking ? item.endTime : null,
    }))

    await updateWorkingHoursMutation(workingHoursData)
    console.log('Working hours updated successfully')
  } catch (error) {
    console.error('Error updating working hours:', error)
  } finally {
    isUpdatingHours.value = false
  }
}

const toggleDayWorking = (dayIndex: number) => {
  const day = workingHours.value[dayIndex]
  if (day.isWorking && (!day.startTime || !day.endTime)) {
    // Si on active le jour et qu'il n'y a pas d'horaires, définir des valeurs par défaut
    day.startTime = '09:00'
    day.endTime = '17:00'
  }
}

const handleConfirmAppointment = async (appointmentId: string) => {
  console.log('🔄 Tentative de confirmation du rendez-vous:', appointmentId)
  try {
    const result = await confirmAppointment(appointmentId)
    console.log('✅ Rendez-vous confirmé avec succès:', result)
    // Success will be handled by the mutation's onSuccess callback
  } catch (error) {
    console.error('❌ Erreur lors de la confirmation du rendez-vous:', error)
  }
}

const editService = (service: any) => {
  editingService.value = { ...service }
}

const closeServiceModal = () => {
  showAddServiceModal.value = false
  editingService.value = null
}

const saveService = (serviceData: any) => {
  if (editingService.value && editingService.value.id) {
    // Update existing service
    updateServiceMutation(editingService.value.id, serviceData)
  } else if (currentUser.value?.id) {
    // Add new service
    createServiceMutation(currentUser.value.id, serviceData)
  }
  closeServiceModal()
}

// Load data on mount
onMounted(() => {
  // Vérifier si nous avons déjà une adresse après le montage
  setTimeout(() => {
    if (profileForm.address && addressMapRef.value) {
      console.log("Géocodage de l'adresse au montage:", profileForm.address)
    }
  }, 2000) // Délai plus long pour s'assurer que tout est prêt
})
</script>
