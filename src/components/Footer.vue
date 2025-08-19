<template>
  <footer class="bg-gray-100 border-t border-gray-200">
    <div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
      <p class="text-sm text-gray-500">{{ t('footer.copyright') }}</p>
      <div class="mt-4 sm:mt-0 flex space-x-6">
        <a href="#" class="text-gray-400 hover:text-gray-500">{{ t('footer.legal') }}</a>
        <a href="#" class="text-gray-400 hover:text-gray-500">{{ t('footer.contact') }}</a>
        <a href="#" class="text-gray-400 hover:text-gray-500">{{ t('footer.linkedin') }}</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
