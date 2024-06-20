<template>
  <div class="border-inherit p-2">
    <div
      class="flex items-center justify-end gap-1 border-b border-inherit px-3 pb-1"
    >
      <TButton
        :icon="downloading ? 'motion_photos_on' : 'download'"
        iconSize="sm"
        label="Download"
        class="flex-auto rounded-md px-3 py-1"
        :iconClass="{ 'animate-spin': downloading }"
        :disabled="selected.length <= 0 || downloading"
        @click="downloadFiles"
      />
    </div>
    <div class="grid gap-1">
      <div
        v-if="!attachments || attachments?.length <= 0"
        class="text-center text-sm italic text-gray-400"
      >
        No Attachments
      </div>
      <template v-for="(attach, index) in attachments" :key="attach.filename">
        <AttachmentItem
          :attachment="attach"
          :active="isSelected(index)"
          @click="(e) => selectFile(e, index)"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";
import JSZip, { file } from "jszip";
import { MimeTypes } from "@/scripts";

const AttachmentItem = defineAsyncComponent(() => import("./attachment.vue"));
const props = defineProps({
  attachments: Object,
});

const selected = ref([]);
const startIndex = ref(-1);
const downloading = ref(false);

const selectFile = (evt, filename) => {
  const index = Object.keys(props.attachments).findIndex((a) => a == filename);
  if (evt.ctrlKey) {
    startIndex.value = -1;
    selectFiles(filename);
  } else if (evt.shiftKey) {
    if (startIndex.value < 0) {
      selected.value = [filename];
      startIndex.value = index;
    } else {
      if (startIndex.value == index) {
        selected.value = [];
        startIndex.value = -1;
      } else {
        const min = Math.min(startIndex.value, index);
        const max = Math.max(startIndex.value, index);
        selected.value = Object.keys(props.attachments).filter(
          (k, index) => index >= min && index <= max
        );
        startIndex.value = -1;
      }
    }
  } else {
    if (isSelected(filename) && selected.value.length <= 1) {
      selected.value = [];
      startIndex.value = -1;
    } else {
      selected.value = [filename];
      startIndex.value = index;
    }
  }
};

const selectFiles = (filename) => {
  if (isSelected(filename)) {
    selected.value = selected.value.filter((f) => f != filename);
  } else {
    selected.value.push(filename);
  }
};

const isSelected = (filename) => {
  return selected.value.findIndex((s) => s == filename) > -1;
};

const downloadFiles = async () => {
  let blob = null;
  let name = "download.zip";

  if (selected.value.length == 1) {
    name = selected.value[0];
    blob = binaryToBlob(
      props.attachments[name].content,
      MimeTypes.lookup(name)
    );
  } else if (selected.value.length > 1) {
    const zip = new JSZip();
    selected.value.forEach((file) => {
      zip.file(file, props.attachments[file].content, { binary: true });
    });
    downloading.value = true;
    blob = await zip.generateAsync({ type: "blob" });
  }
  if (!!blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
  }
};

const binaryToBlob = (data, type) => {
  const blob = new Blob([data], {
    type: type,
  });
  return blob;
};
</script>
