<template>
  <TPopover>
    <template #button>
      <div class="pointer-events-none flex items-center pl-2 pr-0.5">
        Limit: {{ modelValue }}
        <TIcon name="arrow_drop_down" size="sm" />
      </div>
    </template>
    <template #default="{ close }">
      <div class="grid w-16">
        <template v-for="l in limits" :key="`limit_${l}`">
          <TButton
            :label="l"
            class="py-0.5"
            :class="{
              'bg-primary text-light': l == modelValue,
            }"
            @click="emit('update:modelValue', l), close()"
          />
        </template>
      </div>
    </template>
  </TPopover>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 25,
  },
  limits: {
    type: Array,
    default: () => [5, 10, 15, 20, 25, 50, 100, 500],
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>
