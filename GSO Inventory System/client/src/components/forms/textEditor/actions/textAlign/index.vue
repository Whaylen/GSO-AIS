<template>
  <div class="flex items-center gap-0.5">
    <template v-for="action in components" :key="action">
      <component :is="action" :editor="editor" />
    </template>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";

const props = defineProps({
  editor: Object,
});

const components = {
  left: defineAsyncComponent(() => import("./left.vue")),
  center: defineAsyncComponent(() => import("./center.vue")),
  right: defineAsyncComponent(() => import("./right.vue")),
  justify: defineAsyncComponent(() => import("./justify.vue")),
};
</script>
