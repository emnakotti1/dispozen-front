import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createI18n } from "vue-i18n";
import fr from "../locales/fr.json";
import en from "../locales/en.json";

const messages = { fr, en };
const i18n = createI18n({
  legacy: false,
  locale: "fr",
  fallbackLocale: "en",
  messages,
});

createApp(App).mount("#app");
App.use(i18n);
