<template>
  <div class="group flex gap-2 border-b border-foreground/10 font-mono text-sm">
    <div
      class="select-none text-end font-bold text-foreground/40 group-hover:text-foreground/75"
      :style="{
        minWidth: `${lnWidth}px`,
      }"
    >
      {{ ln }}
    </div>
    <div
      :class="{ 'whitespace-nowrap': noWrap }"
      class="px-3"
      :style="{ minWidth: `${length * 7.7 + 24}px` }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  ln: Number,
  lnWidth: Number,
  noWrap: {
    type: Boolean,
    default: true,
  },
  length: {
    type: Number,
    default: 0,
  },
});
</script>
