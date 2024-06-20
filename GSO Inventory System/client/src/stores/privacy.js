import { defineStore } from "pinia";

export const usePrivacyStore = defineStore("privacy", {
  state: () => ({
    accept: false,
    prompt: null,
    id: null,
    loading: false,
  }),
  getters: {},
  actions: {
    acceptPolicy() {
      this.accept = true;
    },
    async loadPolicyPrompt() {
      this.loading = true;
      return new Promise((resolve, reject) => {
        this.$api
          .get(`/policy/prompt`)
          .then((response) => {
            let privacy = response.data.data;
            if (this.id != privacy.id) {
              this.accept = false;
              this.id = privacy.id;
            }
            this.prompt = privacy.prompt;
            resolve(response);
          })
          .catch(reject)
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
});
