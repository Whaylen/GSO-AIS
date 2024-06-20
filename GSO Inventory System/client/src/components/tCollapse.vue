<template>
  <div
    class="grid select-none transition-all duration-300"
    :style="{
      gridTemplateRows: open ? '1fr' : '0fr',
    }"
    ref="container"
  >
    <div
      class="row-[1_/_span_2] select-text overflow-auto"
      :class="{
        'overflow-hidden': !open || transitioning,
      }"
    >
      <template v-if="show || keepAlive">
        <slot></slot>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  keepAlive: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["update:modelValue"]);

const container = ref(null);
const transitioning = ref(false);

const open = computed({
  get: () => {
    return props.modelValue;
  },
  set: (val) => {
    emits("update:modelValue", val);
  },
});

const show = computed(() => transitioning.value || open.value);

const onTransitionEnd = (e) => {
  transitioning.value = false;
};

watch(open, (val) => {
  transitioning.value = true;
});

onMounted(() => {
  container.value.addEventListener("transitionend", onTransitionEnd);
});

onBeforeUnmount(() => {
  container.value.removeEventListener("transitionend", onTransitionEnd);
});
</script>
