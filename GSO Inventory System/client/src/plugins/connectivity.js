import { useSystemStore } from "@/stores";

export default {
  install: (app, options) => {
    const systemStore = useSystemStore();

    systemStore.connectivity.online = window.navigator.onLine;
    window.addEventListener(
      "online",
      () => (systemStore.connectivity.online = true)
    );
    window.addEventListener(
      "offline",
      () => (systemStore.connectivity.online = false)
    );
  },
};
