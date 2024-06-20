<template>
  <Page class="flex min-h-0 min-w-0 max-w-full flex-col items-stretch p-4">
    <div class="flex items-center border-b border-foreground/25 pb-4">
      <div class="px-2">
        <img src="/favicons/baguioseal.svg" class="w-24" />
      </div>
      <div class="px-2">
        <div class="border-b text-sm font-semibold uppercase">
          Republic of the Philippines
        </div>
        <div class="text-4xl font-bold">City Government of Baguio</div>
      </div>
    </div>
    <div class="grid max-w-full items-start">
      <div class="flex min-w-0 items-center gap-2 px-3 py-1">
        <TCheckBox label="Smooth Jump" v-model="smoothJump" />
        <TCheckBox label="Enable Textlayer" v-model="textLayer" />
        <TInput type="number" label="Gap" v-model="gap" :min="1" :max="250" />
      </div>
      <TPdf
        :src="pdfSrc2"
        class="h-screen-80 bg-neutral-200 dark:bg-neutral-900"
        :smoothJump="smoothJump"
        :textLayer="textLayer"
        :gap="gap"
      />
    </div>
  </Page>
</template>

<script setup>
import { ref } from "vue";

// Base64
const pdfSrc = {
  data: atob(
    "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog" +
      "IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv" +
      "TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K" +
      "Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg" +
      "L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+" +
      "PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u" +
      "dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq" +
      "Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU" +
      "CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu" +
      "ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g" +
      "CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw" +
      "MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v" +
      "dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G"
  ),
};

// URL With credentials
const pdfSrc2 = {
  url: new URL("sample/pdf", import.meta.env.VITE_SERVER),
  withCredentials: true,
};

const smoothJump = ref(false);
const textLayer = ref(false);
const gap = ref(10);
</script>
