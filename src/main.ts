import { createApp } from 'vue'
import './style.css'
import './styles/theme-simple.css'
import 'leaflet/dist/leaflet.css'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import fr from '../locales/fr.json'
import en from '../locales/en.json'
import { router } from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'

// Récupérer la langue sauvegardée, normaliser (ex: en-US -> en) et restreindre aux langues supportées
const rawLocale =
  localStorage.getItem('preferred-locale') || navigator.language || 'fr'
const normalized = rawLocale.toLowerCase().split('-')[0]
const savedLocale = ['fr', 'en'].includes(normalized) ? normalized : 'fr'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: savedLocale,
  fallbackLocale: 'fr',
  missingWarn: true,
  fallbackWarn: true,
  flatJson: false,
  messages: { fr: fr as any, en: en as any },
})

// Utility: flatten nested messages into dotted keys
function flattenMessages(obj: any, prefix = ''): Record<string, any> {
  const out: Record<string, any> = {}
  if (obj && typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj)) {
      const nextKey = prefix ? `${prefix}.${key}` : key
      if (val && typeof val === 'object') {
        Object.assign(out, flattenMessages(val as any, nextKey))
      } else {
        out[nextKey] = val
      }
    }
  }
  return out
}

// Register messages explicitly on the global instance (robust in production bundles)
// Also ensure messages are set on the global instance (defensive)
i18n.global.mergeLocaleMessage('fr', fr as any)
i18n.global.mergeLocaleMessage('en', en as any)
// Merge flattened maps too so dotted paths always resolve
i18n.global.mergeLocaleMessage('fr', flattenMessages(fr as any))
i18n.global.mergeLocaleMessage('en', flattenMessages(en as any))
// Ensure global locale is set explicitly
// @ts-ignore - locale is a Ref in composition mode
i18n.global.locale.value = savedLocale

// Expose i18n for runtime debugging once (non-production-safe but fine temporarily)
// @ts-ignore
;(window as any).__i18n = i18n
console.log('[i18n] boot locale=', i18n.global.locale.value)

async function ensureLocaleLoaded(locale: string) {
  try {
    const res = await fetch(`/locales/${locale}/translation.json`, {
      headers: { 'Content-Type': 'application/json' },
    })
    console.log('[i18n] fetch external messages status', res.status)
    if (res.ok) {
      const msgs = await res.json()
      i18n.global.mergeLocaleMessage(locale, msgs)
      i18n.global.mergeLocaleMessage(locale, flattenMessages(msgs))
      console.log(
        `[i18n] merged external messages for ${locale}`,
        Object.keys(msgs),
      )
    } else {
      console.warn(
        `[i18n] failed to fetch external messages for ${locale}:`,
        res.status,
      )
    }
  } catch (e) {
    console.warn('[i18n] ensureLocaleLoaded error:', e)
  }
}

const app = createApp(App)
// Register i18n before router to ensure availability during navigation lifecycle
app.use(i18n)
await ensureLocaleLoaded(savedLocale)
app.use(router)
app.use(VueQueryPlugin)
app.mount('#app')
