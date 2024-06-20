<template>
  <div class="grid">
    <TButton
      class="z-10 rounded-lg border border-foreground/25 px-3 py-1"
      @click="open = !open"
    >
      <div class="pointer-events-none flex items-center gap-2 text-start">
        <TIcon
          name="chevron_right"
          class="transition-transform"
          :class="{ 'rotate-90': open }"
        />
        <div class="flex-auto text-2xl font-semibold">{{ title }}</div>
      </div>
    </TButton>
    <TCollapse v-model="open">
      <div
        v-if="!!content"
        v-html="content"
        class="prose-lg !max-w-none px-3 py-1 dark:prose-invert"
      />
      <div v-else class="text-center font-semibold italic text-gray-400">
        No Content
      </div>
    </TCollapse>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  title: String,
  content: {
    type: String,
    default: null,
  },
});

const open = ref(false);
</script>
