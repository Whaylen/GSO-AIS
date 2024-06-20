<template>
  <div
    class="grid grid-cols-3 items-center border-b border-foreground/25 px-3 py-1"
  >
    <div class="col-start-2 flex items-center justify-center gap-1">
      <TPopover
        :icon="modes[mode].icon"
        iconSize="sm"
        btnClass="p-1 rounded-full"
        v-slot="{ close }"
      >
        <div class="grid min-w-36">
          <template v-for="(m, index) in modes" :key="index">
            <TButton
              :icon="m.icon"
              :label="index"
              iconSize="sm"
              class="rounded-md p-1"
              contentClass="!justify-start"
              :class="{ '': mode == index }"
              @click="emit('update:mode', index), close()"
            />
          </template>
        </div>
      </TPopover>

      <TButton
        icon="arrow_circle_up"
        iconSize="sm"
        class="rounded-full p-1"
        @click="changePage(-1)"
      />

      <TButton
        icon="arrow_circle_down"
        iconSize="sm"
        class="rounded-full p-1"
        @click="changePage(1)"
      />

      <Pager
        :page="page"
        :total="totalPage"
        :emitOnBlur="false"
        @update:page="(p) => emit('update:page', p)"
        class="min-w-16 justify-center"
      />

      <TPopover
        :label="`${+Math.round(scale * 100).toFixed(2)}%`"
        btnClass="p-1 rounded-lg"
        v-slot="{ close }"
      >
        <div class="grid min-w-32">
          <template v-for="s in scales" :key="`scale_${s}`">
            <TButton
              v-if="s.show && (!!s.value || !!s.label)"
              :label="s.label ?? `${s.value * 100}%`"
              class="px-3 py-1 text-sm"
              :class="{ 'bg-primary text-light': scale == s.value }"
              contentClass="!justify-start"
              @click="[_scale(s), close()]"
            />
            <div
              v-if="!s.value && !s.label"
              class="border-b border-gray-400/25"
            />
          </template>
        </div>
      </TPopover>

      <TButton
        icon="rotate_90_degrees_ccw"
        iconSize="sm"
        class="rounded-full p-1"
        @click="rotate(-90)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  totalPage: {
    type: Number,
    default: 0,
  },
  scale: {
    type: Number,
    default: 1,
  },
  scales: {
    type: Array,
    default: () => [
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
        value: "fit",
        show: true,
      },
      {
        label: "Fit Width",
        value: "width",
        show: true,
      },
      {
        label: "Fit Height",
        value: "height",
        show: true,
      },
    ],
  },
  rotation: {
    type: Number,
    default: 0,
    validator: (val) => val % 90 == 0,
  },
  mode: {
    type: String,
    default: "vertical",
    validator: (val) => ["vertical", "horizontal"].indexOf(val) > -1,
  },
});

const emit = defineEmits([
  "update:page",
  "update:scale",
  "update:rotation",
  "update:mode",
  "fitPage",
]);

const modes = ref({
  vertical: {
    icon: "table_rows",
  },
  horizontal: {
    icon: "view_column",
  },
});

const _scale = (s) => {
  emit(isNaN(s.value) ? "fitPage" : "update:scale", s.value);
};

const rotate = (deg) => {
  let rotation = props.rotation + deg;
  if (rotation >= 360 || rotation <= -360) {
    rotation = 0;
  }
  emit("update:rotation", rotation);
};

const changePage = (p) => {
  let page = Math.max(Math.min(props.page + p, props.totalPage), 1);
  emit("update:page", page);
};
</script>
