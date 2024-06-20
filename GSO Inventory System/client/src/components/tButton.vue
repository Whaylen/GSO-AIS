<template>
  <component
    :is="!!to ? (disabled ? 'span' : 'router-link') : tag"
    class="relative overflow-hidden leading-none !outline-none outline-offset-0 after:absolute data-[disabled='true']:cursor-not-allowed data-[disabled='true']:!text-gray-400 data-[disabled='true']:after:inset-0 data-[disabled='true']:after:bg-gray-500 data-[disabled='true']:after:bg-opacity-25 focus:outline-primary"
    :class="[!!to && 'block']"
    v-ripple="_ripple"
    v-bind="Object.assign({}, $attrs, attrs)"
    :data-disabled="disabled"
    :disabled="disabled"
  >
    <FocusHelper :color="focusClass" :disabled="disabled || focusDisabled" />
    <slot>
      <div
        class="pointer-events-none flex flex-auto items-center justify-center gap-1 font-semibold leading-none"
        :class="_contentClass"
      >
        <TIcon
          v-if="!!icon"
          :name="icon"
          :size="iconSize"
          :class="{ ..._iconClass }"
        />
        <span v-if="!!label" class="uppercase leading-none">
          {{ `${label}` }}
        </span>
      </div>
    </slot>
  </component>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { useRouter } from "vue-router";
import { Helpers } from "@/scripts";

const slots = useSlots();
const router = useRouter();

const props = defineProps({
  tag: {
    type: String,
    default: "button",
  },
  label: {
    type: [String, Number],
    default: "",
  },
  icon: {
    type: String,
    default: null,
  },
  iconSize: {
    type: String,
    default: "md",
    validator: (val) => {
      return (
        ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"].indexOf(
          val
        ) > -1
      );
    },
  },
  iconClass: {
    type: [String, Object],
    default: () => [],
  },
  contentClass: {
    type: [String, Object],
    default: () => [],
  },
  focusClass: {
    type: String,
    default: "bg-foreground",
  },
  focusDisabled: {
    type: Boolean,
    default: false,
  },
  ripple: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  to: {
    type: Object,
    default: null,
  },
});

const attrs = computed(() => {
  let _attrs = {};
  if (!!props.to && !props.disabled) {
    Object.assign(_attrs, { to: props.to });
  }
  return _attrs;
});

const _contentClass = computed(() =>
  Helpers.classFormatter(props.contentClass)
);

const _ripple = computed(() => {
  let r = {};
  Object.assign(r, props.ripple);
  if (props.disabled) {
    Object.assign(r, { disabled: true });
  }
  return r;
});

const _iconClass = computed(() => Helpers.classFormatter(props.iconClass));
</script>
