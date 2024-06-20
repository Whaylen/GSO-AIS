<template>
  <ActionButton
    icon="format_align_right"
    :active="editor.isActive({ textAlign: 'right' })"
    @click="editor.chain().focus().setTextAlign('right').run()"
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
