<template>
  <div class="grid gap-2 rounded-lg p-2">
    <div
      v-if="!!title"
      class="border-b border-foreground/25 text-2xl font-semibold"
    >
      {{ title }}
    </div>
    <div
      v-html="content"
      class="prose prose-lg !max-w-none dark:prose-invert"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useSystemStore } from "@/stores";

const systemStore = useSystemStore();

const props = defineProps({
  title: {
    type: String,
    default: null,
  },
  content: {
    type: String,
    default: null,
  },
});
</script>
