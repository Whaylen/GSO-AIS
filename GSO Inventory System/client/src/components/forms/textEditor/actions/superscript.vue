<template>
  <ActionButton
    icon="superscript"
    :active="editor?.isActive('superscript')"
    @click="editor?.chain().focus().toggleSuperscript().run()"
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
