<template>
  <TCard class="relative h-screen-95 w-screen-95">
    <TCardHeader>
      <TCardTitle> System Log </TCardTitle>
      <TButton icon="close" class="rounded-full p-1" @click="emit('close')" />
    </TCardHeader>
    <TCardBody>
      <template v-if="hasError">
        <div
          class="relative h-full text-center text-lg font-semibold text-negative"
        >
          Log file is too large to preview. Please download the file instead!
          <div
            class="absolute bottom-0 right-32 leading-none text-primary/50 delay-100"
          >
            <TIcon
              name="keyboard_double_arrow_down"
              size="2xl"
              class="animate-bounce"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <template v-if="logged.length <= 0">
          <div class="text-center font-semibold italic text-gray-400">
            No logs!
          </div>
        </template>
        <Logged v-else :log="logged" />
      </template>
    </TCardBody>
    <TCardFooter class="flex items-stretch justify-end gap-2">
      <TButton icon="refresh" class="rounded-lg px-3 py-1" @click="loadLogs" />
      <TButton
        label="Delete"
        icon="delete"
        class="rounded-lg border border-negative bg-negative/25 px-3 py-1"
        @click="confirmDelete"
      />
      <div class="relative rounded-lg border border-primary leading-none">
        <div
          v-if="hasError"
          class="pointer-events-none absolute inset-0 scale-90 animate-ping rounded-lg border border-primary bg-primary/25"
        />
        <TButton
          label="Download"
          :icon="downloading ? 'motion_photos_on' : 'download'"
          :iconClass="{ 'animate-spin': downloading }"
          class="rounded-lg bg-primary/25 px-3 py-1"
          :disabled="downloading"
          @click="fileDownload"
        />
      </div>
      <TButton
        label="close"
        class="hidden rounded-lg px-3 py-1 md:block"
        @click="emit('close')"
      />
    </TCardFooter>
    <TInnerLoading :active="loading" />
    <TDialog v-model="deleteLog.show" contain v-slot="{ close }">
      <Deleter @close="close" @delete="onDelete" />
    </TDialog>
  </TCard>
</template>

<script setup>
import { computed, defineAsyncComponent, inject, onMounted, ref } from "vue";
import Axios from "axios";
import { Helpers, notify } from "@/scripts";

const $api = inject("$api");

const Deleter = defineAsyncComponent(() => import("./delete.vue"));
const Logged = defineAsyncComponent(() => import("./logs.vue"));

const emit = defineEmits(["close"]);

const logs = ref("");
const logSize = ref(0);
const loading = ref(false);
const hasError = ref(false);

const deleteLog = ref({
  show: false,
});

const downloading = ref(false);

const logged = computed(() =>
  logs.value != "" ? logs.value.split(/\r?\n/) : []
);

const loadLogs = () => {
  loading.value = true;
  hasError.value = false;
  $api
    .get(
      "/log/system"
      // , {
      //   onDownloadProgress: (progressEvent) => {
      //     console.log(progressEvent);
      //   },
      // }
    )
    .then((response) => {
      logs.value = response.data;
      logSize.value = response.headers["content-length"] * 1;
    })
    .catch((error) => {
      hasError.value = !!error.response.data.size;
      logSize.value = error.response.data.size ?? 0;
    })
    .finally(() => {
      loading.value = false;
    });
};

const download = () => {
  loading.value = true;
  hasError.value = false;
  $api.get("/log/system/dl").finally(() => {
    loading.value = false;
  });
};

const fileDownload = () => {
  downloading.value = true;

  let uri = `${Helpers.stripSlashes(
    import.meta.env.VITE_SERVER
  )}/log/system/dl`;

  Axios({
    url: uri,
    method: "GET",
    responseType: "blob",
    withCredentials: true,
  })
    .then((response) => {
      // create file link in browser's memory
      const href = window.URL.createObjectURL(response.data);
      const fname = "laravel.log";

      // create "a" HTML element with href to file & click
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", fname); //or any other extension
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    })
    .catch((error) => {
      notify({
        title: "No Log File",
        type: "info",
        message: error.response.data.message,
      });
    })
    .finally(() => {
      downloading.value = false;
    });
};

const confirmDelete = () => {
  deleteLog.value.show = true;
};

const onDelete = () => {
  logs.value = "";
  deleteLog.value.show = false;
  hasError.value = false;
};

onMounted(loadLogs);
</script>
