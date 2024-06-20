<template>
  <ActionButton
    icon="format_bold"
    :active="editor?.isActive('bold')"
    @click="editor?.chain().focus().toggleBold().run()"
  />
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const ActionButton = defineAsyncComponent(() =>
  import("./utils/actionButton.vue")
);
const props = defineProps({
  editor: Object,
});
</script>
