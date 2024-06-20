<template>
  <ActionButton
    icon="format_align_center"
    :active="editor.isActive({ textAlign: 'center' })"
    @click="editor.chain().focus().setTextAlign('center').run()"
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
