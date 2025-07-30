<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <h1 class="bg-red-500 text-3xl font-bold underline">
    {{ t("message.hello") }}
  </h1>
</template>

<style scoped></style>
