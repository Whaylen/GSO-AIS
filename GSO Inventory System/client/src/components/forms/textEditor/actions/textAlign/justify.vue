<template>
  <ActionButton
    icon="format_align_justify"
    :active="editor.isActive({ textAlign: 'justify' })"
    @click="editor.chain().focus().setTextAlign('justify').run()"
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
