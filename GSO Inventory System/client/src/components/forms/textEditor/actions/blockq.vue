<template>
  <ActionButton
    icon="format_quote"
    :active="editor?.isActive('blockquote')"
    @click="editor?.chain().focus().toggleBlockquote().run()"
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
