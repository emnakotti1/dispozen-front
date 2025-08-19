<template>
  <div class="relative inline-block text-left">
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer min-w-[120px]"
      >
        <img
          :src="getCurrentFlag()"
          :alt="getCurrentLanguage()"
          class="w-5 h-3 object-cover rounded-sm"
        />
        <span>{{ getCurrentLanguage() }}</span>
        <svg
          class="w-4 h-4 ml-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      <div
        v-if="isDropdownOpen"
        class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10"
      >
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="selectLanguage(lang.code)"
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
          :class="{
            'bg-indigo-50 text-indigo-700': currentLocale === lang.code,
          }"
        >
          <img
            :src="lang.flag"
            :alt="lang.name"
            class="w-5 h-3 object-cover rounded-sm"
          />
          <span>{{ lang.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLocale = ref(locale.value)
const isDropdownOpen = ref(false)

const languages = [
  { code: 'fr', name: 'Français', flag: '/flags/fr.svg' },
  { code: 'en', name: 'English', flag: '/flags/gb.svg' },
]

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectLanguage = langCode => {
  currentLocale.value = langCode
  locale.value = langCode
  localStorage.setItem('preferred-locale', langCode)
  isDropdownOpen.value = false
}

const getCurrentFlag = () => {
  const lang = languages.find(l => l.code === currentLocale.value)
  return lang ? lang.flag : languages[0].flag
}

const getCurrentLanguage = () => {
  const lang = languages.find(l => l.code === currentLocale.value)
  return lang ? lang.name : languages[0].name
}

const changeLanguage = () => {
  locale.value = currentLocale.value
  localStorage.setItem('preferred-locale', currentLocale.value)
}

onMounted(() => {
  const savedLocale = localStorage.getItem('preferred-locale')
  if (savedLocale) {
    currentLocale.value = savedLocale
    locale.value = savedLocale
  }

  // Fermer le dropdown si on clique ailleurs
  document.addEventListener('click', e => {
    if (!e.target.closest('.relative')) {
      isDropdownOpen.value = false
    }
  })
})
</script>
