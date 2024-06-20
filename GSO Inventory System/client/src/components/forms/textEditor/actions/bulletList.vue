<template>
  <ActionButton
    icon="format_list_bulleted"
    class="list rounded-none"
    :active="editor?.isActive('bulletList')"
    @click="editor?.chain().focus().toggleBulletList().run()"
  />
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import { BulletList } from "@tiptap/extension-bullet-list";

const ActionButton = defineAsyncComponent(() =>
  import("./utils/actionButton.vue")
);
const props = defineProps({
  editor: Object,
});
</script>
