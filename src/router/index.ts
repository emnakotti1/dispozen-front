
import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/login.vue";
import Register from "../pages/registration.vue";
import ProvidersList from "../pages/ProvidersList.vue"; 
import ProviderServices from "../pages/ProviderServices.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
   { path: "/providers", component: ProvidersList },
     { path: "/providers/:id/services", component: ProviderServices },
  { path: "/", redirect: "/register" }, 
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
