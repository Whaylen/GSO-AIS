<template>
  <ActionButton
    icon="link"
    :active="editor?.isActive('link')"
    @click="emit('modal', 'link')"
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
