<template>
  <TPopover
    :label="`${year}`"
    placement="bottom-start"
    arrow
    v-slot="{ close }"
  >
    <div class="grid max-h-screen-40 w-screen-95 max-w-32 overflow-y-auto py-1">
      <template v-for="y in years" :key="`year_${y}`">
        <TButton
          class="px-3 py-1"
          :class="{ 'bg-primary text-light': y == year }"
          @click="y != year && emit('update:modelValue', y), close()"
        >
          <div class="text-start">{{ y }}</div>
        </TButton>
      </template>
    </div>
  </TPopover>
</template>

<script setup>
import { computed, ref } from "vue";
import dayjs from "dayjs";
import { useVModel } from "@vueuse/core";

const props = defineProps({
  modelValue: Number,
});

const emit = defineEmits(["update:modelValue"]);

const year = useVModel(props, "modelValue", emit);

const years = computed(() =>
  Array.from(Array(dayjs().year() - 1900).keys(), (x) => x + 1901).reverse()
);
</script>
