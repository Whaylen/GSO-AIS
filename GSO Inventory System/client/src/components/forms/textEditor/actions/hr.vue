<template>
  <ActionButton
    icon="horizontal_rule"
    @click="editor?.chain().focus().setHorizontalRule().run()"
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
