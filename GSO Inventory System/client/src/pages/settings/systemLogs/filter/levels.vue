<template>
  <div class="flex flex-col gap-2 lg:flex-row lg:items-start">
    <div
      class="flex items-center justify-center rounded-2xl text-2xl font-bold md:min-w-80"
    >
      <LevelGraph :levels="levels" :summary="summary" />
    </div>
    <div class="grid flex-auto grid-cols-3 gap-2">
      <TCard
        v-for="(level, index) in levels"
        :key="level.label"
        class="select-none border-2 !bg-opacity-25 transition"
        :class="{
          [level.twColor]: index == 0 || (index > 0 && isActive(index)),
          'border-gray-400 bg-gray-400': index > 0 && !isActive(index),
          'cursor-pointer hover:!bg-opacity-75': index > 0 && filterable,
        }"
        @click="index > 0 && filterable && toggleFilter(index)"
      >
        <TCardBody class="overflow-clip !p-0">
          <div class="flex min-h-16 flex-col items-center sm:flex-row">
            <div
              v-if="!sm"
              :class="{
                [level.twColor]: index == 0 || (index > 0 && isActive(index)),
                'border-gray-400 bg-gray-400': index > 0 && !isActive(index),
              }"
              class="flex items-center justify-center self-stretch text-light transition md:p-3"
            >
              <TIcon :name="level.icon" :size="sm ? 'md' : 'lg'" />
            </div>
            <div class="flex flex-auto flex-col px-1 py-2 md:px-3">
              <div class="flex items-center gap-1 font-black uppercase">
                <TIcon v-if="sm" :name="level.icon" />
                <div class="flex-auto text-sm sm:text-base lg:text-lg">
                  {{ level.label }}
                </div>
              </div>
              <div class="whitespace-nowrap text-xs">
                {{
                  `${summary[index]?.total ?? 0} entries${
                    index > 0 ? " - " + (summary[index]?.prct ?? 0) + "%" : ""
                  }`
                }}
              </div>
              <TProgress
                v-if="index > 0"
                :value="(summary[index]?.prct ?? 0) * 1"
                class="!min-h-1 !bg-foreground/25 before:!bg-light"
              />
            </div>
          </div>
        </TCardBody>
      </TCard>
    </div>
  </div>
</template>

<script setup>
import { useVModel } from "@vueuse/core";
import { defineAsyncComponent, inject, ref, watch } from "vue";

const $screen = inject("$screen");
const sm = $screen.value.greaterOrEqual("sm");

const LevelGraph = defineAsyncComponent(() => import("./graph.vue"));

const props = defineProps({
  levels: Object,
  summary: Object,
  filters: {
    type: Array,
    default: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  filterable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:filters"]);

const _filters = useVModel(props, "filters", emit);

const toggleFilter = (level) => {
  if (isActive(level)) {
    _filters.value = _filters.value.filter((l) => l != level);
  } else {
    let tmp = [..._filters.value];
    tmp.push(level);
    _filters.value = tmp;
  }
};

const isActive = (level) => {
  return props.filters.includes(level);
};
</script>
