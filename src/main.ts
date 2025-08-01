import { createApp } from 'vue'
import './style.css'
import './styles/theme-simple.css'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import fr from '../locales/fr.json'
import en from '../locales/en.json'
import { router } from './router'

const messages = { fr, en }

// Récupérer la langue sauvegardée ou utiliser 'fr' par défaut
const savedLocale = localStorage.getItem('preferred-locale') || 'fr'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'fr',
  messages,
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
