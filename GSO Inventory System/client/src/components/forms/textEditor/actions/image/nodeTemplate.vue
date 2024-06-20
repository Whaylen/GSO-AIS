<template>
  <NodeViewWrapper as="span">
    <figure class="relative my-2 inline-block">
      <img
        v-bind="node.attrs"
        :draggable="isDraggable"
        :data-drag-handle="isDraggable"
        ref="resizableImg"
        class="inline-block"
      />
      <div
        v-if="selected || isResizing"
        class="pointer-events-none absolute -bottom-1 -left-1 -right-1 -top-1 border border-blue-700"
      />
      <div
        v-if="selected || isResizing"
        class="absolute -bottom-2 -right-2 aspect-square w-2 cursor-se-resize bg-blue-700"
        @mousedown="onMouseDown"
      />
    </figure>
  </NodeViewWrapper>
</template>

<script setup>
import { computed, ref } from "vue";
import { NodeViewWrapper, nodeViewProps } from "@tiptap/vue-3";
const props = defineProps({
  ...nodeViewProps,
});

const isResizing = ref(false);
const lastMovement = ref({});
const aspectRatio = ref(0);
const count = ref(0);
const resizableImg = ref(null);
const stateSelection = ref({});
const initialDim = ref({});

const isDraggable = computed(() => props.node?.attrs?.isDraggable);

const throttle = (fn, wait = 60, leading = true) => {
  let prev, timeout, lastargs;

  return (...args) => {
    lastargs = args;
    if (timeout) return;

    timeout = setTimeout(
      () => {
        timeout = null;
        prev = Date.now();
        fn.apply(this, lastargs.splice(0, lastargs.length));
      },
      leading ? (prev && Math.max(0, wait - Date.now() + prev)) || 0 : wait
    );
  };
};

const onMouseDown = (e) => {
  e.preventDefault();

  let state = props.editor?.view.state;
  let { selection } = state;
  let { from, to } = selection;
  stateSelection.value = { from, to };
  initialDim.value = {
    width: resizableImg.value.width,
    height: resizableImg.value.height,
  };

  isResizing.value = true;
  aspectRatio.value =
    resizableImg.value.naturalWidth / resizableImg.value.naturalHeight;

  window.addEventListener("mousemove", throttle(onMouseMove));
  window.addEventListener("mouseup", onMouseUp);
};

const onMouseUp = (e) => {
  isResizing.value = false;
  lastMovement.value = {};
  props.editor.commands.setNodeSelection(stateSelection.value.from);

  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
};

const onMouseMove = (e) => {
  e.preventDefault();
  if (!isResizing.value) {
    return;
  }
  if (!Object.keys(lastMovement.value).length) {
    lastMovement.value = { x: e.x, y: e.y };
    return;
  }
  if (e.x === lastMovement.value.x && e.y === lastMovement.value.y) {
    return;
  }

  props.editor.chain().focus();
  let nextX = e.x - lastMovement.value.x;
  let nextY = e.y - lastMovement.value.y;

  let width = initialDim.value.width + nextX;
  let height = initialDim.value.height; // + nextY;

  // if (direction.value == "vertical") {
  // height = resizableImg.value.height + nextY;
  //   width = height * aspectRatio.value;
  // } else {
  // width = resizableImg.value.width + nextX;
  //   height = width * aspectRatio.value;
  // }

  // lastMovement.value = { x: e.x, y: e.y };
  props.updateAttributes({ width, height });
};
</script>
