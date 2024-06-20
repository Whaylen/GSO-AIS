<template>
  <ActionButton
    icon="format_list_numbered"
    :active="editor?.isActive('orderedList')"
    @click="editor?.chain().focus().toggleOrderedList().run()"
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
