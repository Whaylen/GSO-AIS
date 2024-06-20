import { createApp, computed } from "vue";
import "./css/index.scss";
import App from "./app.vue";
import MyComponents from "@/components";
import router from "@/router";
//import "./websockets";

import { api, axios } from "./axios.js";
import { pinia, useAuthStore, usePrivacyStore } from "./stores";
import { PiniaSharedState } from "pinia-shared-state";

import Notifications from "notiwind";
import VueApexCharts from "vue3-apexcharts";

import TRipple from "@/plugins/directives/tRipple";
import TrapFocus from "@/plugins/directives/trapFocus";
import HackedText from "./plugins/directives/hackedText";

import PWAInstallPrompt from "@/plugins/pwaInstallPrompt";
import DevDetect from "@/plugins/devDetect";
import AuthCheck from "@/plugins/authCheck";
import Themed from "@/plugins/themed";
import Connectivity from "@/plugins/connectivity";
import SideBar from "@/plugins/sidebar";

import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

async function init() {
  const app = createApp(App);

  for (let component in MyComponents) {
    app.component(component, MyComponents[component]);
  }

  pinia.use(() => ({
    $api: api,
    $axios: axios,
    $router: router,
  }));
  pinia.use(
    PiniaSharedState({
      type: "localstorage",
    })
  );

  app.use(router);
  app.use(pinia);
  app.use(Notifications);
  app.use(VueApexCharts);

  app.use(PWAInstallPrompt);
  app.use(DevDetect, {
    redirect: { name: "HomePage" },
    wagmongsubukan: import.meta.env.VITE_DEV_TOOLS == "true",
  });
  app.use(AuthCheck);
  app.use(Themed);
  app.use(Connectivity);
  app.use(SideBar);

  app.directive("ripple", TRipple);
  app.directive("trapFocus", TrapFocus);
  app.directive("hackedText", HackedText);

  try {
    const authStore = useAuthStore();
    const privacyStore = usePrivacyStore();

    if (authStore.isLoggedIn) {
      await authStore.getPermissions();
    }

    await privacyStore.loadPolicyPrompt();
  } catch (e) {}

  app.config.globalProperties.$api = api;
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$system = {
    product_name: import.meta.env.VITE_PRODUCT_NAME,
    short_name: import.meta.env.VITE_SHORT_NAME,
    description: import.meta.env.VITE_DESCRIPTION,
    office_name: import.meta.env.VITE_OFFICE_NAME,
  };

  for (let prop in app.config.globalProperties) {
    app.provide(prop, app.config.globalProperties[prop]);
  }
  const $screen = computed(() => useBreakpoints(breakpointsTailwind));
  app.provide("$screen", $screen);

  app.mount("#app");
}

init();
