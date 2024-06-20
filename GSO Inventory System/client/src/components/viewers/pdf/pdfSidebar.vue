<template>
  <div class="flex border-r border-foreground/25">
    <div
      class="flex h-full flex-auto overflow-hidden border-inherit transition-all"
      :class="{
        'w-64': expand,
        'w-0': !expand,
      }"
    >
      <div
        v-if="!!slots.actions && expand"
        class="flex flex-col gap-2 border-r border-inherit px-1 py-3"
      >
        <slot name="actions"> </slot>
      </div>
      <div v-if="expand" class="flex h-full w-64 flex-col border-inherit">
        <div
          class="flex items-center gap-2 border-b border-inherit py-1 pl-3 pr-2"
        >
          <span class="flex-auto font-semibold text-foreground/75">
            {{ label }}
          </span>
          <TButton
            icon="close"
            iconSize="sm"
            class="rounded-full p-1"
            @click="expand = false"
          />
        </div>
        <slot />
      </div>
    </div>
    <TButton
      icon="arrow_right"
      iconSize="sm"
      :iconClass="{
        'transition-transform': true,
        'rotate-180': expand,
      }"
      class="border-l border-inherit"
      @click="expand = !expand"
    />
  </div>
</template>

<script setup>
import { ref, useSlots } from "vue";

const props = defineProps({
  label: String,
});

const expand = ref(false);
const slots = useSlots();
</script>
