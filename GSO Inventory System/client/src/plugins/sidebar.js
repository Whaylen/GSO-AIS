import { ref } from "vue";
export default {
  install: (app, options) => {
    const rtlSideBar = ref({
      collapsed: false,
      menu: [],
    });
    const sideBar = ref({
      collapsed: false,
      menu: [],
    });

    app.provide("sideBar", sideBar);
    app.provide("rtlSideBar", rtlSideBar);
  },
};
