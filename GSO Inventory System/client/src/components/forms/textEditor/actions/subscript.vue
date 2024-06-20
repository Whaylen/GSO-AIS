<template>
  <ActionButton
    icon="subscript"
    :active="editor?.isActive('subscript')"
    @click="editor?.chain().focus().toggleSubscript().run()"
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
