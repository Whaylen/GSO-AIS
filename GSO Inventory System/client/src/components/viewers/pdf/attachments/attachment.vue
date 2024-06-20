<template>
  <div
    class="relative flex select-none items-center gap-1 rounded-sm px-2 py-1"
    :class="{
      'bg-primary/75 text-light': active,
    }"
  >
    <span class="w-screen-95 max-w-7">
      <TFileIcon
        :name="getFileExt(attachment.filename)"
        class="h-full w-full"
      />
    </span>
    <div class="flex-auto">
      <div class="line-clamp-2 break-all text-xs">
        {{ attachment.filename }}
      </div>
      <div class="break-all text-xs">
        {{ Helpers.formatFileSize(attachment.content.byteLength) }}
      </div>
    </div>
    <FocusHelper />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { MimeTypes, Helpers } from "@/scripts";

const props = defineProps({
  attachment: Object,
  active: {
    type: Boolean,
    default: false,
  },
});

const getFileExt = (filename) => {
  return MimeTypes.extractExtension(filename);
};
</script>
