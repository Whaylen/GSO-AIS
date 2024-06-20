<template>
  <TButton class="w-full rounded-lg border border-transparent px-3 py-1">
    <div class="pointer-events-none flex items-center gap-1 whitespace-nowrap">
      <TIcon v-if="!!icon" :name="icon" :type="iconType" :class="_iconClass" />
      <div
        v-if="!!label"
        class="flex-auto whitespace-nowrap text-start font-semibold"
        :class="_labelClass"
      >
        {{ label }}
      </div>
      <TIcon
        v-if="!!rightIcon"
        :name="rightIcon"
        :type="rightIconType"
        :class="_rightIconClass"
      />
    </div>
    <TToolTip v-if="!!tooltip" :position="tooltipPosition" arrow>
      {{ tooltip }}
    </TToolTip>
  </TButton>
</template>

<script setup>
import { computed, ref } from "vue";
import { Helpers } from "@/scripts";

const props = defineProps({
  label: String,
  icon: {
    type: String,
    default: null,
  },
  iconType: {
    type: String,
    default: "outlined",
  },
  iconClass: {
    type: [Object, String],
    default: () => [],
  },
  rightIcon: {
    type: String,
    default: null,
  },
  rightIconType: {
    type: String,
    default: "outlined",
  },
  rightIconClass: {
    type: [Object, String],
    default: () => [],
  },
  tooltip: {
    type: String,
    default: null,
  },
  tooltipPosition: {
    type: String,
    default: "right",
  },
  labelClass: {
    type: [Object, String],
    default: () => [],
  },
});

const _iconClass = computed(() => Helpers.classFormatter(props.iconClass));

const _rightIconClass = computed(() =>
  Helpers.classFormatter(props.rightIconClass)
);

const _labelClass = computed(() => Helpers.classFormatter(props.labelClass));
</script>
