<template>
  <aside
    class="flex h-screen flex-col"
    :class="{
      'fixed inset-y-0': fixed,
      'right-0': fixed && rtl,
      'left-0': fixed && !rtl,
      'sticky ': !fixed,
    }"
    :style="{
      top: topOffset,
      maxHeight: maxHeight,
    }"
    ref="asidebar"
  >
    <slot name="before"></slot>
    <div class="flex-auto overflow-y-auto overflow-x-clip">
      <slot name="prepend"></slot>
      <div class="grid w-full gap-1 p-3" :class="_contentClass">
        <slot />
      </div>
      <slot name="append"></slot>
    </div>
    <slot name="after">
      <div class="min-h-[]20rem"></div>
    </slot>
  </aside>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useSystemStore } from "@/stores";
import { Helpers } from "@/scripts";

const props = defineProps({
  headerSize: {
    type: Object,
    default: null,
  },
  rtl: {
    type: Boolean,
    default: false,
  },
  fixed: {
    type: Boolean,
    default: false,
  },
  contentClass: {
    type: [Object, String],
    default: () => [],
  },
});

const emit = defineEmits(["transitionEnd"]);

const systemStore = useSystemStore();

const scrollOffset = ref(0);
const asidebar = ref(null);

const parentEl = computed(() => asidebar.value?.parentElement ?? null);
const parentYPadding = computed(() => {
  let parentStyles = !!parentEl.value
    ? window.getComputedStyle(parentEl.value)
    : {};
  let parentPadding =
    (parseFloat(parentStyles.paddingTop) ?? 0) +
    (parseFloat(parentStyles.paddingBottom) ?? 0);
  return isNaN(parentPadding) ? 0 : parentPadding;
});
const rightBar = computed(() => systemStore.settings.sidebar.right);
const topOffset = computed(() => {
  let paddingY = parentYPadding.value / 2;
  let headerHeight = props.headerSize?.height ?? 0;
  let offset = systemStore.settings.navbar.fixed
    ? `${headerHeight + paddingY}px`
    : `${paddingY}px`;
  return !props.fixed ? offset : "";
});
const maxHeight = computed(() => {
  let leOffset = (props.headerSize?.height ?? 0) - scrollOffset.value;
  leOffset = leOffset <= 0 ? 0 : leOffset;
  let offset = systemStore.settings.navbar.fixed
    ? props.headerSize?.height ?? 0
    : leOffset;

  return !props.fixed
    ? `calc(100dvh - ${offset + parentYPadding.value}px )`
    : "100dvh";
});

const _contentClass = computed(() =>
  Helpers.classFormatter(props.contentClass)
);

const onBodyScroll = (e) => {
  scrollOffset.value = Math.floor(window.scrollY);
};

const onTransitionEnd = (e) => {
  if (e.target == asidebar.value) {
    emit("transitionEnd", e);
  }
};

onMounted(() => {
  document.addEventListener("scroll", onBodyScroll);
  asidebar.value.addEventListener("transitionend", onTransitionEnd);
});

onBeforeUnmount(() => {
  document.removeEventListener("scroll", onBodyScroll);
  asidebar.value.removeEventListener("transitionend", onTransitionEnd);
});
</script>
