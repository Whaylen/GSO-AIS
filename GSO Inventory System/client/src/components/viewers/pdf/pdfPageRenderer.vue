<template>
  <div class="leading-none">
    <div class="relative rounded-lg bg-white leading-none text-dark">
      <canvas
        ref="canva"
        class="box-border h-full w-full rounded-lg border border-foreground/25 bg-white text-dark outline-none focus-within:border focus-within:border-primary focus:shadow-primary/25 focus:dark:border-info focus:dark:shadow-info/50"
        :class="{
          hidden: rendering,
        }"
        :tabindex="pageInfo.page"
        :width="pageInfo.viewport.width"
        :height="pageInfo.viewport.height"
      />
      <div ref="_textLayer" v-if="textLayer" class="textLayer" />
      <div
        v-if="false"
        class="pointer-events-none absolute bottom-0 left-1/2 min-w-4 -translate-x-1/2 select-none rounded-t-md bg-dark/75 px-1 text-center text-xs font-semibold leading-tight text-light"
      >
        {{ pageInfo.page }}
      </div>
      <TInnerLoading :active="rendering" class="!bg-white/50 backdrop-blur-sm">
        <div class="flex flex-col items-center text-dark">
          <TIcon name="motion_photos_on" size="md" class="animate-spin" />
        </div>
      </TInnerLoading>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
} from "vue";
import { ImageKind, renderTextLayer } from "pdfjs-dist";
const props = defineProps({
  pageInfo: Object,
  pdf: Object,
  textLayer: {
    type: Boolean,
    default: false,
  },
  render: {
    type: Boolean,
    default: false,
  },
});

const rendering = ref(false);
const canva = ref(null);
const renderer = shallowRef();
const renderedPage = shallowRef();

const _textLayer = ref(null);

const ctx = computed(() =>
  canva.value.getContext("2d", {
    alpha: false,
    willReadFrequently: true,
  })
);

const renderPage = async () => {
  if (!rendering.value) {
    rendering.value = true;
    const { viewport, page } = props.pageInfo;
    const { promise } = props.pdf;
    const doc = await promise;

    try {
      renderedPage.value = await doc.getPage(page);
      const renderContext = {
        canvasContext: ctx.value,
        viewport,
      };
      renderer.value = renderedPage.value.render(renderContext);
      await renderer.value.promise;

      if (props.textLayer) {
        await renderTextContent();
      }
    } catch (e) {
      if (e.name != "RenderingCancelledException") {
      }
    } finally {
      rendering.value = false;
      renderedPage.value.cleanup();
    }
  }
};

const renderTextContent = async () => {
  const { viewport } = props.pageInfo;
  const { rotation, scale } = viewport;
  const textContent = await renderedPage.value.getTextContent();
  renderTextLayer({
    textContentSource: textContent,
    textContent: textContent,
    container: _textLayer.value,
    viewport,
    textDivs: [],
  });
  let rat = viewport.width / viewport.height;
  let r = "";

  if (Math.abs(rotation) == 90) {
    r += `translateY(${100 / rat}%)`;
  }

  if (Math.abs(rotation) == 180) {
    r += `translate(100%, 100%)`;
  }

  if (Math.abs(rotation) == 270) {
    r += `translateX(${100 * rat}%)`;
  }

  r += `rotate(${rotation}deg)`;
  _textLayer.value.style.setProperty("--scale-factor", scale);
  _textLayer.value.style.webkitTransform = r;
  _textLayer.value.style.mozTransform = r;
  _textLayer.value.style.msTransform = r;
  _textLayer.value.style.oTransform = r;
  _textLayer.value.style.transform = r;
};

watch(
  () => props.textLayer,
  (val) => {
    if (val) {
      renderTextContent();
    }
  }
);

watch(
  () => props.render,
  async (val) => {
    if (val && !renderedPage.value) {
      await renderPage();
    }
  }
);

onMounted(async () => {
  if (props.render) {
    await renderPage();
  }
});

onBeforeUnmount(async () => {
  if (rendering.value) {
    renderer.value.cancel();
  }
  renderedPage.value?.cleanup();
});
</script>

<style lang="scss">
@use "pdfjs-dist/web/pdf_viewer.css";
.textLayer span {
  line-height: 1;
}
</style>
