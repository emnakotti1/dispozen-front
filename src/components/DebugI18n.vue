<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n({ useScope: 'global' })

onMounted(() => {
  // Log a few checks in console
  console.log('[i18n] locale =', locale.value)
  console.log('[i18n] title =', t('message.auth.login.title'))
})
</script>

<template>
  <div class="text-xs text-gray-400 space-y-1">
    <div>Locale: {{ locale }}</div>
    <div>Title: {{ t('message.auth.login.title') }}</div>
  </div>
</template>
