<template>
  <div class="grid gap-2">
    <div
      class="rounded-[inherit] bg-background-accent px-3 py-1"
      :class="{
        'sticky z-50': stickyHeader,
        'top-0': !systemStore.settings.navbar.fixed,
        'top-12': systemStore.settings.navbar.fixed,
      }"
    >
      <div
        v-if="!!label || !!slots.title"
        class="border-foreground/25 text-2xl font-semibold last:border-b"
      >
        <slot name="title">
          {{ label }}
        </slot>
      </div>
      <div
        v-if="!!description || !!slots.description"
        class="border-foreground/25 last:border-b"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </div>
    </div>
    <div class="flex flex-col gap-2 px-3 py-1">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, useSlots } from "vue";
import { useSystemStore } from "@/stores";

const systemStore = useSystemStore();

const slots = useSlots();
const props = defineProps({
  label: String,
  description: {
    type: String,
    default: null,
  },
  stickyHeader: {
    type: Boolean,
    default: false,
  },
});
</script>
