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

const { locale } = useI18n({ useScope: 'global' })
const currentLocale = ref(locale.value)
const isDropdownOpen = ref(false)

const languages = [
  { code: 'fr', name: 'Français', flag: '/flags/fr.svg' },
  { code: 'en', name: 'English', flag: '/flags/gb.svg' },
]

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectLanguage = async langCode => {
  const norm = (langCode || '').toLowerCase().split('-')[0]
  const final = ['fr', 'en'].includes(norm) ? norm : 'fr'
  currentLocale.value = final
  locale.value = final
  localStorage.setItem('preferred-locale', final)
  isDropdownOpen.value = false

  // Ensure messages for the selected locale are loaded (uses global instance exposed on window)
  try {
    const res = await fetch(`/locales/${final}/translation.json`, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) {
      const msgs = await res.json()
  const i18n = window.__i18n
      if (i18n) {
        i18n.global.mergeLocaleMessage(final, msgs)
        // Also merge flattened for dotted paths
        const flatten = (obj, p = '') =>
          Object.entries(obj || {}).reduce((acc, [k, v]) => {
            const key = p ? `${p}.${k}` : k
            if (v && typeof v === 'object') Object.assign(acc, flatten(v, key))
            else acc[key] = v
            return acc
          }, {})
        i18n.global.mergeLocaleMessage(final, flatten(msgs))
      }
    }
  } catch (e) {
    console.debug('i18n load on switch failed', e)
  }
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
  const saved = localStorage.getItem('preferred-locale')
  const norm = (saved || '').toLowerCase().split('-')[0]
  const final = ['fr', 'en'].includes(norm) ? norm : 'fr'
  currentLocale.value = final
  locale.value = final

  // Fermer le dropdown si on clique ailleurs
  document.addEventListener('click', e => {
    if (!e.target.closest('.relative')) {
      isDropdownOpen.value = false
    }
  })
})
</script>
