<template>
  <ActionButton
    icon="strikethrough_s"
    :active="editor?.isActive('strike')"
    @click="editor?.chain().focus().toggleStrike().run()"
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
