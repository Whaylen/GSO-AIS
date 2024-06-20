<template>
  <ActionButton
    icon="format_align_left"
    :active="editor.isActive({ textAlign: 'left' })"
    @click="editor.chain().focus().setTextAlign('left').run()"
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
</script>
