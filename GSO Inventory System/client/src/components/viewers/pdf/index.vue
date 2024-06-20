<template>
  <div class="relative flex flex-col border border-foreground/25">
    <PDFMenu
      :totalPage="pageNum"
      :page="page"
      v-model:scale="scale"
      v-model:rotation="rotation"
      v-model:mode="mode"
      @update:page="changePage"
      @fitPage="fitPage"
    />

    <div class="relative flex min-h-0 flex-auto">
      <div
        v-if="progress > 0 && progress < 100"
        class="absolute inset-x-0 top-0"
      >
        <TProgress :value="progress"></TProgress>
      </div>

      <PDFSidebar :label="sideBars[sidebar].label">
        <template #actions>
          <template v-for="(sb, key) in sideBars" :key="key">
            <TButton
              :icon="sb.icon"
              class="rounded-md px-1 py-3"
              :class="{ 'bg-foreground/10': sidebar == key }"
              @click="sidebar = key"
            />
          </template>
        </template>

        <PDFVuer
          v-if="sidebar == 'thumbnails'"
          ref="preview"
          :pdf="pdf"
          :rotation="rotation"
          :page="tmpPage"
          :gap="40"
          :scale="0.15"
          class="flex-auto !items-start overflow-x-hidden"
        >
          <template #renderer="{ pageInfo, render }">
            <div
              class="absolute grid cursor-pointer select-none items-center justify-center rounded-lg border-dashed border-foreground leading-none"
              :class="{
                'border bg-info/25': pageInfo.page == tmpPage,
              }"
              :style="{
                top: `${pageInfo.bounds.inner.top - 5}px`,
                left: `${pageInfo.bounds.inner.left - 10}px`,
                width: `${pageInfo.viewport.width + 20}px`,
                height: `${pageInfo.viewport.height + 10}px`,
              }"
              @click="
                [changePage(pageInfo.page), preview.changePage(pageInfo.page)]
              "
            >
              <div class="relative leading-none">
                <PDFPageRenderer
                  :pageInfo="pageInfo"
                  :render="render"
                  :pdf="pdf"
                />
                <div
                  class="absolute inset-x-0 -bottom-5 text-center text-sm font-semibold leading-none"
                >
                  {{ pageInfo.page }}
                </div>
              </div>
            </div>
          </template>
        </PDFVuer>

        <PDFOutline
          v-if="sidebar == 'bookmarks'"
          :outline="outline"
          @changePage="(e) => changePage(e.page, e.offset)"
          class="flex-auto overflow-y-scroll"
        />

        <PDFAttachments
          v-if="sidebar == 'attachments'"
          :attachments="attachments"
          class="flex-auto overflow-y-scroll"
        />
      </PDFSidebar>

      <PDFVuer
        ref="viewer"
        :pdf="pdf"
        :onProgress="onParserProgress"
        :gap="gap"
        :rotation="rotation"
        :view="mode"
        :smoothJump="smoothJump"
        :textLayer="textLayer"
        v-model:scale="scale"
        v-model:page="page"
        class="flex-auto"
        @mousewheel="onMouseWheel"
        @wheel="onMouseWheel"
      >
        <template #prepend>
          <div
            v-if="!!error"
            class="flex items-center gap-2 self-start bg-negative px-3 py-1 text-sm font-semibold italic text-light"
          >
            <TIcon name="error" size="sm" /> {{ error }}
          </div>
        </template>
      </PDFVuer>
    </div>
    <TDialog v-model="password.show" contain persistent>
      <PDFPassword :callback="password.callback" :reason="password.reason" />
    </TDialog>
  </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted, ref, watch } from "vue";
import usePdf from "@/plugins/composables/usePdf";

const PDFVuer = defineAsyncComponent(() => import("./pdfVuer.vue"));
const PDFOutline = defineAsyncComponent(() => import("./outline/index.vue"));
const PDFPassword = defineAsyncComponent(() =>
  import("./pdfPasswordPrompt.vue")
);
const PDFSidebar = defineAsyncComponent(() => import("./pdfSidebar.vue"));
const PDFPageRenderer = defineAsyncComponent(() =>
  import("./pdfPageRenderer.vue")
);
const PDFAttachments = defineAsyncComponent(() =>
  import("./attachments/index.vue")
);
const PDFMenu = defineAsyncComponent(() => import("./menu.vue"));

const props = defineProps({
  src: [
    String,
    Object,
    URL,
    ArrayBuffer,
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    BigInt64Array,
    BigUint64Array,
  ],

  gap: {
    type: Number,
    default: 10,
  },

  smoothJump: {
    type: Boolean,
    default: false,
  },
  textLayer: {
    type: Boolean,
    default: false,
  },
});

const viewer = ref(null);
const preview = ref(null);
const progress = ref(0);
const mode = ref("vertical");
const error = ref(null);

const scale = ref(1);
const scales = ref([
  {
    value: 0.25,
    show: true,
  },
  {
    value: 0.333,
    show: false,
  },
  {
    value: 0.5,
    show: true,
  },
  {
    value: 0.584,
    show: false,
  },
  {
    value: 0.667,
    show: false,
  },
  {
    value: 0.75,
    show: true,
  },
  {
    value: 1,
    show: true,
  },
  {
    value: 1.25,
    show: true,
  },
  {
    value: 1.5,
    show: true,
  },
  {
    value: 2,
    show: true,
  },
  {
    value: 4,
    show: true,
  },
  {
    value: 8,
    show: true,
  },
  {
    show: true,
  },
  {
    label: "Fit Page",
    show: true,
  },
  {
    label: "Fit Width",
    show: true,
  },
  {
    label: "Fit Height",
    show: true,
  },
]);
const rotation = ref(0);
const page = ref(1);
const tmpPage = ref(1);

const sidebar = ref("thumbnails"); // outline, page, attachments
const sideBars = ref({
  thumbnails: {
    icon: "file_copy",
    label: "Page Thumbnails",
  },
  bookmarks: {
    icon: "bookmark_border",
    label: "Bookmarks",
  },
  attachments: {
    icon: "attachment",
    label: "Attachments",
  },
});

const password = ref({
  reason: 0,
  callback: null,
  data: null,
  show: false,
});

const {
  pdf,
  pages: pageNum,
  outline,
  attachments,
} = usePdf({
  src: props.src,
  onProgress: (e) => {
    progress.value = Math.floor((e.loaded / e.total) * 25);
  },
  onError: (e) => {
    error.value = e.message ?? "Failed to load document";
    progress.value = 100;
  },
  onPassword: (callback, reason) => {
    if (reason >= 1) {
      password.value.callback = (pass) => {
        callback(pass);
        password.value.show = false;
      };
      password.value.reason = reason;
      password.value.show = true;
    }
  },
});

const onParserProgress = (e) => {
  progress.value = Math.floor((e.loaded / e.total) * 75) + 25;
};

const onMouseWheel = (e) => {
  if (e.ctrlKey) {
    e.preventDefault();
    let scaleIndex = scales.value.findIndex((s) => s.value == scale.value);
    if (e.wheelDeltaY > 0) {
      scaleIndex =
        scaleIndex > -1
          ? scaleIndex
          : scales.value.findIndex((s) => s.value >= scale.value) - 1;
      scaleIndex = Math.min(
        scaleIndex + 1,
        scales.value.filter((s) => !!s.value).length - 1
      );
    } else {
      scaleIndex =
        scaleIndex > -1
          ? scaleIndex
          : scales.value.findLastIndex((s) => s.value <= scale.value) + 1;
      scaleIndex = Math.max(scaleIndex - 1, 0);
    }
    scale.value = scales.value[scaleIndex].value;
  }
};

const changePage = (p, offset = null) => {
  tmpPage.value = p;
  preview.value?.changePage(p);
  viewer.value.changePage(p, offset);
};

const fitPage = (f) => {
  scale.value = viewer.value?.fitPage(f);
};

watch(
  () => viewer.value?.render,
  (val) => {
    if (val) {
      tmpPage.value = viewer.value?.currentPage;
      preview.value?.changePage(tmpPage.value);
    }
  }
);
</script>
