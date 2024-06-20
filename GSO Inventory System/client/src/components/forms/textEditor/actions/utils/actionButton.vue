<template>
  <TButton
    class="box-border rounded-lg border p-0.5"
    :class="[
      active ? 'border-foreground/25 bg-primary/25' : 'border-transparent',
    ]"
  >
    <slot>
      <div class="pointer-events-none flex items-center justify-center gap-1">
        <TIcon v-if="!!icon" :name="icon" :type="iconType" :size="iconSize" />
        <div v-if="!!label" class="font-semibold leading-none">{{ label }}</div>
      </div>
    </slot>
  </TButton>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  label: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  iconType: {
    type: String,
    default: "outlined",
  },
  iconSize: {
    type: String,
    default: "md",
  },
  active: {
    type: Boolean,
    default: false,
  },
});
</script>
