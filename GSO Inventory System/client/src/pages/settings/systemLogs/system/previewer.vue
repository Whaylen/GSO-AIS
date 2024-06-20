<template>
  <TButton
    icon="visibility"
    label="View System Log"
    class="rounded-lg border border-primary bg-primary/25 px-3 py-1"
    @click="preview = true"
  />
  <TDialog v-model="preview" persistent v-slot="{ close }">
    <LogPreview @close="close" />
  </TDialog>
</template>

<script setup>
import { defineAsyncComponent, inject, ref } from "vue";

const $api = inject("$api");

const LogPreview = defineAsyncComponent(() => import("./preview.vue"));

const preview = ref(false);
</script>
