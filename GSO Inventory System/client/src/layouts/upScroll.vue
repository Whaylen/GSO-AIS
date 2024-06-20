<template>
  <teleport to="body">
    <div
      class="fixed right-0 z-50 flex items-center justify-center transition-all"
      :class="{
        '-translate-x-1/2 opacity-100': show,
        'pointer-events-none translate-x-full opacity-0': !show,
        'bottom-[6.5rem]': atTheBottom,
        'bottom-12': !atTheBottom,
      }"
    >
      <TButton
        icon="keyboard_double_arrow_up"
        class="rounded-full border-t border-foreground/25 bg-gray-300 p-2 text-foreground dark:bg-gray-700"
        @click="scrollUp"
      />
    </div>
  </teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
const props = defineProps({});

const show = ref(false);
const scrollData = ref({});

const atTheBottom = computed(
  () =>
    scrollData.value.ScrollTop + scrollData.value.OffsetHeight >=
    scrollData.value.ScrollHeight - 108 / 2
);

const scrollUp = () => {
  document.documentElement.scroll({ top: 0, behavior: "smooth" });
};

const onScroll = (e) => {
  let el = e.target.documentElement;
  show.value = el.scrollTop > 30;
  scrollData.value = {
    ScrollTop: el.scrollTop,
    OffsetHeight: el.offsetHeight,
    ScrollHeight: el.scrollHeight,
  };
};

onMounted(() => {
  document.addEventListener("scroll", onScroll);
});

onBeforeUnmount(() => {
  document.removeEventListener("scroll", onScroll);
});
</script>
