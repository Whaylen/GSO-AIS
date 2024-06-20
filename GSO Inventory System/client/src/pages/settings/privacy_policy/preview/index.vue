<template>
  <div v-if="loading" class="flex items-center justify-center">
    <TIcon name="loop" class="rotate-180 transform animate-spin" />
  </div>

  <template v-else-if="!!privacy">
    <div class="flex-auto">
      <div class="grid gap-5">
        <div
          class="sticky z-20 flex items-stretch gap-2 border-b border-foreground/25 bg-background-accent px-3 py-1"
          :class="{
            'top-12': systemStore.settings.navbar.fixed,
            'top-0': !systemStore.settings.navbar.fixed,
          }"
        >
          <div class="flex-auto">
            <TButton
              label="Back"
              icon="chevron_left"
              class="rounded-lg py-1 pr-3"
              @click="router.back()"
            />
          </div>
          <div class="flex items-stretch gap-2">
            <TButton
              v-if="!privacy.active"
              class="rounded-lg border border-positive bg-positive/25 px-3 py-1"
              :disabled="activator.loading"
              @click="activatePolicy"
            >
              <div
                class="pointer-events-none relative flex items-center gap-2 font-semibold uppercase"
              >
                <span
                  class="leading-none"
                  :class="{ 'opacity-0': activator.loading }"
                >
                  Activate
                </span>
              </div>
              <div
                v-if="activator.loading"
                class="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <TIcon name="motion_photos_on" class="animate-spin" />
              </div>
            </TButton>
            <TButton
              label="Use as template"
              class="flex items-center justify-center rounded-lg border border-foreground/25 px-3 py-1"
              :to="{
                name: 'privacy-settings-editor',
                params: { id: privacy.id },
              }"
            />
          </div>
        </div>
        <div
          class="grid gap-5 rounded-lg border border-foreground/25 px-3 py-2"
        >
          <div class="flex items-center gap-2">
            <div class="flex-auto">
              <span class="font-bold">Last Updated: </span>
              {{ Helpers.formatDate(privacy.date) }}
            </div>
            <div v-if="!!privacy.active" class="">
              <span class="font-bold">Activated on: </span>
              {{ Helpers.formatDate(privacy.active) }}
            </div>
          </div>
          <template v-for="policy in privacy.policies" :key="policy.id">
            <component
              :is="previewItems[policy.collapsible ? 'collapsing' : 'infoItem']"
              :title="policy.title"
              :content="policy.content"
            />
          </template>
        </div>
      </div>
    </div>
  </template>
  <div v-else class="text-center font-semibold italic text-negative">
    Policy not found!
  </div>
</template>

<script setup>
import { defineAsyncComponent, inject, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Helpers } from "@/scripts";
import { useSystemStore } from "@/stores";

const $api = inject("$api");
const route = useRoute();
const router = useRouter();
const systemStore = useSystemStore();

const previewItems = {
  collapsing: defineAsyncComponent(() => import("./collapse.vue")),
  infoItem: defineAsyncComponent(() => import("./info.vue")),
};

const loading = ref(false);
const privacy = ref(null);
const activator = ref({
  loading: false,
});

const loadPrivacy = (id) => {
  loading.value = true;

  $api
    .get(`/policy/privacy/${id}`)
    .then((response) => {
      privacy.value = response.data.data;
    })
    .finally(() => {
      loading.value = false;
    });
};

const activatePolicy = () => {
  activator.value.loading = true;

  $api
    .post(`/policy/activate/${route.params.id}`)
    .then((response) => {
      privacy.value = response.data.data;
    })
    .finally(() => {
      activator.value.loading = false;
    });
};

onMounted(() => {
  loadPrivacy(route.params.id);
});
</script>
