<template>
  <template v-if="!outline || outline?.length <= 0">
    <div class="text-center text-sm italic text-gray-400">No Outline</div>
  </template>
  <template v-for="outl in outline" :key="`${outl.page}_${outl.title}`">
    <OutlineItem :outline="outl" @changePage="changePage" />
  </template>
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";

const OutlineItem = defineAsyncComponent(() => import("./outlineItem.vue"));
const props = defineProps({
  outline: Array,
});

const emit = defineEmits(["changePage"]);

const changePage = (e) => {
  emit("changePage", e);
};
</script>
