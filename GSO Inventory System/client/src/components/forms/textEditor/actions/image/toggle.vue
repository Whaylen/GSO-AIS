<template>
  <ActionButton
    icon="image"
    :active="editor?.isActive('ResizableImage')"
    @click="emit('modal', 'image')"
  />
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const ActionButton = defineAsyncComponent(() =>
  import("../utils/actionButton.vue")
);
const props = defineProps({
  editor: Object,
});

const emit = defineEmits(["modal"]);
</script>
