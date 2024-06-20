<template>
  <div class="px-3 py-1">
    <Outlines :outline="outline" @changePage="changePage" />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";

const OutlineItem = defineAsyncComponent(() => import("./outlineItem.vue"));
const Outlines = defineAsyncComponent(() => import("./outlines.vue"));
const props = defineProps({
  outline: Array,
});
const emit = defineEmits(["changePage"]);

const changePage = (e) => {
  emit("changePage", e);
};
</script>
