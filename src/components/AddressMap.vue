<template>
  <div class="space-y-4">
    <!-- Champs d'adresse -->
    <div>
      <label for="address" class="block text-sm font-medium text-gray-700">
        Adresse
      </label>
      <div class="mt-1 flex rounded-md shadow-sm">
        <input
          type="text"
          id="address"
          v-model="localAddress"
          @input="searchAddress"
          @blur="updateAddress"
          class="flex-1 rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Tapez votre adresse..."
        />
        <button
          type="button"
          @click="getCurrentLocation"
          class="relative -ml-px inline-flex items-center border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          📍 Ma position
        </button>
      </div>
    </div>

    <!-- Carte -->
    <div class="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
      <div
        ref="mapContainer"
        class="map-container"
        style="height: 400px; width: 100%; min-height: 400px"
      ></div>
    </div>

    <!-- Coordonnées (pour debug) -->
    <div v-if="coordinates" class="text-xs text-gray-500">
      Lat: {{ coordinates.lat.toFixed(6) }}, Lng:
      {{ coordinates.lng.toFixed(6) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'

// Fix pour les icônes Leaflet avec Vite - icône personnalisée SVG
const DefaultIcon = L.divIcon({
  html: `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0zm0 17.5c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z" fill="#3B82F6"/>
  </svg>`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'custom-div-icon',
})

L.Marker.prototype.options.icon = DefaultIcon

interface Props {
  modelValue?: string
  postalCode?: string
  city?: string
  governorate?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:postalCode', value: string): void
  (e: 'update:city', value: string): void
  (e: 'update:governorate', value: string): void
  (e: 'coordinates-updated', coordinates: { lat: number; lng: number }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const mapContainer = ref<HTMLElement>()
const localAddress = ref(props.modelValue || '')
const coordinates = ref<{ lat: number; lng: number } | null>(null)

let map: L.Map | null = null
let marker: L.Marker | null = null

// Coordonnées par défaut (centre de la France)
const defaultCenter: [number, number] = [46.603354, 1.888334]

onMounted(() => {
  // Utiliser un délai pour s'assurer que le DOM est complètement rendu
  setTimeout(() => {
    initMap()
  }, 100)
})

// Fonction pour géocoder l'adresse initiale quand elle est fournie via les props
const handleInitialAddress = async () => {
  if (props.modelValue && props.modelValue.trim() && map) {
    console.log("Traitement de l'adresse initiale:", props.modelValue)
    localAddress.value = props.modelValue
    await searchAddress()
  }
}

watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    console.log('🔄 Props watch - newValue:', newValue, 'oldValue:', oldValue)

    if (newValue !== localAddress.value) {
      localAddress.value = newValue || ''
      console.log('📝 localAddress mis à jour:', localAddress.value)

      // Si une nouvelle adresse est fournie et que la carte est initialisée
      if (newValue && newValue.trim() && map && newValue !== oldValue) {
        console.log('🚀 Déclenchement géocodage automatique pour:', newValue)
        setTimeout(async () => {
          await searchAddress()
        }, 500)
      }
    }
  },
  { immediate: true },
)

const initMap = () => {
  if (!mapContainer.value) {
    console.log('Container not ready, retrying...')
    setTimeout(() => initMap(), 100)
    return
  }

  try {
    // Créer la carte avec des dimensions explicites
    map = L.map(mapContainer.value, {
      preferCanvas: false,
      attributionControl: true,
    }).setView(defaultCenter, 6)

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    // Ajouter un événement de clic sur la carte
    map.on('click', e => {
      const { lat, lng } = e.latlng
      updateMarker(lat, lng)
      reverseGeocode(lat, lng)
    })

    // Forcer le redimensionnement après un délai plus long
    setTimeout(() => {
      if (map) {
        map.invalidateSize()
        console.log('Map size invalidated')

        // Géocoder l'adresse existante après que la carte soit prête
        setTimeout(() => {
          handleInitialAddress()
        }, 200)
      }
    }, 500)

    console.log('Map initialized successfully')
  } catch (error) {
    console.error('Error initializing map:', error)
  }
}

const updateMarker = (lat: number, lng: number) => {
  if (!map) return

  coordinates.value = { lat, lng }
  emit('coordinates-updated', { lat, lng })

  // Supprimer le marqueur existant
  if (marker) {
    map.removeLayer(marker)
  }

  // Ajouter un nouveau marqueur
  marker = L.marker([lat, lng]).addTo(map)

  // Centrer la carte sur le marqueur
  map.setView([lat, lng], 13)
}

const searchAddress = async () => {
  if (!localAddress.value.trim() || localAddress.value.length < 3) {
    console.log('Adresse trop courte ou vide:', localAddress.value)
    return
  }

  console.log("Recherche de l'adresse:", localAddress.value)

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        localAddress.value,
      )}&limit=1&addressdetails=1`,
    )
    const data = await response.json()

    if (data && data.length > 0) {
      const result = data[0]
      const lat = parseFloat(result.lat)
      const lng = parseFloat(result.lon)

      console.log('Coordonnées trouvées:', { lat, lng })
      console.log("Détails de l'adresse:", result)
      updateMarker(lat, lng)

      // Utiliser les détails d'adresse structurés si disponibles
      if (result.address) {
        const address = result.address

        // Code postal
        if (address.postcode) {
          emit('update:postalCode', address.postcode)
        }

        // Ville (différents champs possibles selon le pays)
        const city =
          address.city ||
          address.town ||
          address.village ||
          address.municipality
        if (city) {
          emit('update:city', city)
        }

        // Gouvernorat/Province/État (différents champs selon le pays)
        const governorate =
          address.state ||
          address.province ||
          address.county ||
          address.state_district
        if (governorate) {
          emit('update:governorate', governorate)
        }
      } else {
        // Fallback: parser le display_name si pas de détails structurés
        const addressParts = result.display_name.split(', ')

        // Chercher le code postal (4-5 chiffres pour s'adapter à différents pays)
        const postalCodeMatch = result.display_name.match(/\b\d{4,5}\b/)
        if (postalCodeMatch) {
          emit('update:postalCode', postalCodeMatch[0])
        }

        // Chercher la ville (généralement avant le code postal)
        const cityIndex = addressParts.findIndex((part: string) =>
          /\b\d{4,5}\b/.test(part),
        )
        if (cityIndex > 0) {
          emit('update:city', addressParts[cityIndex - 1])
        }

        // Extraire le gouvernorat (généralement après la ville)
        if (cityIndex > 0 && cityIndex < addressParts.length - 2) {
          const governorateCandidate = addressParts[cityIndex + 1]
          if (
            governorateCandidate &&
            !governorateCandidate.match(/\b(France|Belgique|Belgium)\b/i)
          ) {
            emit('update:governorate', governorateCandidate.trim())
          }
        }
      }
    } else {
      console.log("Aucun résultat trouvé pour l'adresse:", localAddress.value)
    }
  } catch (error) {
    console.error('Erreur lors de la géocodage:', error)
  }
}

const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
    )
    const data = await response.json()

    if (data && data.display_name) {
      localAddress.value = data.display_name
      emit('update:modelValue', data.display_name)

      // Extraire le code postal, la ville et le gouvernorat
      const address = data.address
      if (address) {
        if (address.postcode) {
          emit('update:postalCode', address.postcode)
        }
        if (address.city || address.town || address.village) {
          const city = address.city || address.town || address.village
          emit('update:city', city)
        }
        // Extraire le gouvernorat (state, county, ou département)
        if (address.state || address.county || address.state_district) {
          const governorate =
            address.state || address.county || address.state_district
          emit('update:governorate', governorate)
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors du géocodage inverse:', error)
  }
}

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("La géolocalisation n'est pas supportée par ce navigateur.")
    return
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords
      updateMarker(latitude, longitude)
      reverseGeocode(latitude, longitude)
    },
    error => {
      console.error('Erreur de géolocalisation:', error)
      alert("Impossible d'obtenir votre position actuelle.")
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    },
  )
}

const updateAddress = () => {
  emit('update:modelValue', localAddress.value)
}

// Méthode exposée pour forcer le géocodage depuis le parent
const forceGeocodeAddress = async (address: string) => {
  if (!address || !address.trim()) {
    console.log("Pas d'adresse à géocoder")
    return
  }

  console.log('Force géocodage de:', address)
  localAddress.value = address

  if (map) {
    await searchAddress()
  } else {
    console.log('Carte pas encore initialisée, géocodage différé')
    // Attendre que la carte soit prête
    const checkMap = setInterval(() => {
      if (map) {
        clearInterval(checkMap)
        searchAddress()
      }
    }, 100)
  }
}
</script>

<style scoped>
/* Styles personnalisés pour la carte */
.map-container {
  position: relative;
  z-index: 1;
  height: 400px !important;
  width: 100% !important;
  min-height: 400px;
  display: block;
}

:deep(.leaflet-container) {
  height: 400px !important;
  width: 100% !important;
  border-radius: 0.5rem;
  font-family: inherit;
}

:deep(.leaflet-control-attribution) {
  background: rgba(255, 255, 255, 0.8);
  font-size: 0.7rem;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

:deep(.custom-div-icon) {
  background: transparent !important;
  border: none !important;
}

/* Assurer que tous les éléments enfants prennent la bonne taille */
.map-container > div,
.map-container > div > div {
  height: 400px !important;
  width: 100% !important;
}
</style>
