<template>
  <ActionButton
    icon="data_object"
    :active="editor?.isActive('codeBlock')"
    @click="editor?.chain().focus().toggleCodeBlock().run()"
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
