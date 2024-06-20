<template>
  <div
    ref="container"
    class="bg-gray/25 relative grid h-full min-h-0 w-full min-w-0 items-center overflow-scroll"
    :class="{
      'grid items-center': viewMode != 'vertical',
    }"
  >
    <slot v-bind="slotBinds" name="prepend" />
    <div
      class="relative mx-auto"
      :style="{
        width: `${containerBounds.width}px`,
        height: `${containerBounds.height}px`,
      }"
    >
      <slot v-bind="slotBinds">
        <template v-for="vp in visiblePages" :key="vp.id">
          <slot name="renderer" :pdf="pdf" :pageInfo="vp" :render="render">
            <PDFPageRenderer
              :pageInfo="vp"
              :pdf="pdf"
              class="absolute"
              :textLayer="textLayer"
              :render="render"
              :style="{
                top: `${vp.bounds.inner.top}px`,
                left: `${vp.bounds.inner.left}px`,
                width: `${vp.viewport.width}px`,
                height: `${vp.viewport.height}px`,
              }"
            />
          </slot>
        </template>
      </slot>
    </div>
    <slot v-bind="slotBinds" name="append" />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { usePdfViewer } from "@/plugins/composables";

const PDFPageRenderer = defineAsyncComponent(() =>
  import("./pdfPageRenderer.vue")
);

const props = defineProps({
  pdf: Object,

  scale: {
    type: Number,
    default: 1.0,
  },

  gap: {
    type: Number,
    default: 10,
  },

  rotation: {
    type: Number,
    default: 0,
    validator: (val) => {
      const result = val % 90 == 0;
      if (!result) {
        throw new Error("Rotation prop must be a number and a multiple of 90.");
      }
      return result;
    },
  },

  view: {
    type: String,
    default: "vertical",
    validator: (val) => {
      const result = ["vertical", "horizontal"].indexOf(val.toLowerCase()) > -1;
      if (!result) {
        throw new Error('view prop must either be "vertical" or "horizontal".');
      }
      return result;
    },
  },

  onProgress: {
    type: Function,
    default: null,
  },

  page: {
    type: Number,
    default: 1,
  },

  textLayer: {
    type: Boolean,
    default: false,
  },

  smoothJump: {
    type: Boolean,
    default: false,
  },

  renderDelay: {
    type: Number,
    default: 50,
  },
});

const emit = defineEmits(["update:page", "update:scale"]);

const container = ref(null);

const slotBinds = computed(() => ({
  numPages: totalPage,
  progress: progress,
  pages: pageInfo,
  container: containerBounds,
  currentPage: currentPage,
  visiblePages: visiblePages,
  render: render,
  viewMode: viewMode,
  changePage,
  nextPage,
  prevPage,
  fitWidth,
  fitHeight,
  fitPage,
}));

const {
  totalPage,
  pageInfo,
  containerBounds,
  scrollState,
  progress,
  render,
  currentPage,
  visiblePages,
  scale,
  rotation,
  viewMode,
  readPDF,
  getPageInfo,
  getBounds,
  getVBounds,
  getHBounds,
  getInnerBounds,
  getGaps,
  updateProgress,
  getVisiblePages,
  boundsIntersecting,
  onContainerScroll,
  inRange,
  getCurrentPage,
  nextPage,
  prevPage,
  changePage,
  getFitRatio,
  fitWidth,
  fitHeight,
  fitPage,
} = usePdfViewer(container, props);

watch(progress, (val) => {
  props.onProgress?.(val);
});

watch(currentPage, (val) => {
  emit("update:page", val);
});

watch(scale, (val) => {
  emit("update:scale", val);
});

defineExpose({
  numPages: totalPage,
  progress: progress,
  pages: pageInfo,
  container: containerBounds,
  currentPage: currentPage,
  visiblePages: visiblePages,
  render: render,
  viewMode: viewMode,
  changePage,
  nextPage,
  prevPage,
  fitWidth,
  fitHeight,
  fitPage,
});
</script>
