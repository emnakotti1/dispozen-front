<template>
  <header class="bg-white">
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1">
        <a href="#" class="-m-1.5 p-1.5">
          <img
            class="h-16 w-auto mx-auto"
            :src="logo"
            alt="Logo de l'entreprise"
          />
        </a>
      </div>
      <div class="flex lg:hidden">
        <button
          @click="mobileMenuOpen = true"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="size-6" />
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <a
          v-for="item in navigation"
          :key="item.name"
          :href="item.href"
          class="text-sm font-semibold text-gray-900"
          >{{ item.name }}</a
        >
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <a href="#" class="text-sm font-semibold text-gray-900">
          {{ t("message.navigation.login") }} &rarr;
        </a>
      </div>
    </nav>

    <Dialog
      as="div"
      class="lg:hidden"
      :open="mobileMenuOpen"
      @close="mobileMenuOpen = false"
    >
      <DialogPanel
        class="fixed inset-y-0 right-0 z-50 w-full bg-white p-6 sm:max-w-sm"
      >
        <div class="flex items-center justify-between">
          <a href="#" class="-m-1.5 p-1.5">
            <img
              class="h-8 w-auto"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
          </a>
          <button
            @click="mobileMenuOpen = false"
            class="-m-2.5 rounded-md p-2.5 text-gray-700"
          >
            <XMarkIcon class="size-6" />
          </button>
        </div>
        <div class="mt-6">
          <div class="space-y-2">
            <a
              v-for="item in navigation"
              :key="item.name"
              :href="item.href"
              class="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
            >
              {{ item.name }}
            </a>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { Dialog, DialogPanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useI18n } from "vue-i18n";
import logo from "../assets/logo.png";

const { t } = useI18n();
const mobileMenuOpen = ref(false);

const navigation = computed(() => [
 
  { name: t("message.navigation.calendar"), href: "#" },
  { name: t("message.navigation.services"), href: "#" },
  { name: t("message.navigation.contact"), href: "#" },
]);
</script>
