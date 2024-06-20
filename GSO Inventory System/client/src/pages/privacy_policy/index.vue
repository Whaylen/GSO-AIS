<template>
  <div class="max-w-3xl">
    <div class="text-5xl font-semibold">Privacy Policy</div>
    <template v-if="loading">
      <div class="text-center leading-none">
        <TIcon name="motion_photos_on" class="animate-spin" />
      </div>
    </template>
    <template v-if="!loading && !!privacy">
      <div class="text-sm font-semibold italic text-gray-400">
        {{ Helpers.formatDate(privacy.active) }}
      </div>
      <div class="grid gap-5 px-3 py-2">
        <template v-for="policy in privacy.policies" :key="policy.id">
          <component
            :is="previews[policy.collapsible ? 'collapsible' : 'info']"
            :title="policy.title"
            :content="policy.content"
            class="odd:bg-foreground/5"
          />
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
import { defineAsyncComponent, inject, onMounted, ref } from "vue";
import { Helpers } from "@/scripts";

const $api = inject("$api");

const previews = {
  collapsible: defineAsyncComponent(() =>
    import("@/pages/settings/privacy_policy/preview/collapse.vue")
  ),
  info: defineAsyncComponent(() =>
    import("@/pages/settings/privacy_policy/preview/info.vue")
  ),
};

const loading = ref(false);
const privacy = ref(null);

const loadPrivacyPolicy = () => {
  loading.value = true;
  $api
    .get("/policy/public")
    .then((response) => {
      privacy.value = response.data.data;
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  loadPrivacyPolicy();
});
</script>
