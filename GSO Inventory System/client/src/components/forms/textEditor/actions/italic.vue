<template>
  <ActionButton
    icon="format_italic"
    :active="editor?.isActive('italic')"
    @click="editor?.chain().focus().toggleItalic().run()"
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
