<template>
  <div class="flex items-center gap-2">
    <div class="flex flex-auto items-center gap-2 text-3xl font-semibold">
      <YearSelect
        :modelValue="input.year"
        @update:modelValue="onYearChange"
        btnClass="rounded-lg px-3 py-1"
      />
      <template v-if="input.month != null">
        <span class="leading-none">/</span>
        <template v-if="input.day != null">
          <div class="relative leading-none">
            <TButton
              :label="monthName"
              class="rounded-lg px-3 py-1"
              @click="clearDay"
            />
            <span
              class="absolute -right-2 top-0 flex items-center justify-center"
            >
              <TButton
                icon="close"
                iconSize="sm"
                class="rounded-full bg-negative text-light"
                @click="clearMonth"
              />
            </span>
          </div>
        </template>
        <template v-else>
          <div class="relative rounded-lg px-3 py-1 uppercase leading-none">
            {{ monthName }}
            <span
              class="absolute -right-2 top-0 flex items-center justify-center"
            >
              <TButton
                icon="close"
                iconSize="sm"
                class="rounded-full bg-negative text-light"
                @click="clearMonth"
              />
            </span>
          </div>
        </template>
        <template v-if="input.day != null">
          <span class="leading-none">/</span>
          <div class="relative rounded-lg px-3 py-1 uppercase leading-none">
            {{ input.day }}
          </div>
        </template>
      </template>
    </div>
    <div v-if="!!slots.default" class="flex items-center gap-1">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref, useSlots } from "vue";
import dayjs from "dayjs";
import { useVModel } from "@vueuse/core";

const YearSelect = defineAsyncComponent(() => import("./yearSelect.vue"));

const slots = useSlots();

const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(["update:modelValue", "year", "month"]);

const input = useVModel(props, "modelValue", emit);

const onYearChange = (e) => {
  input.value = {
    year: e,
    month: null,
    day: null,
  };
};
const monthName = computed(() =>
  !!input.value.month
    ? dayjs()
        .month(input.value.month - 1)
        .format("MMMM")
    : null
);

const clearMonth = () => {
  input.value = {
    year: input.value.year,
    month: null,
    day: null,
  };
};

const clearDay = () => {
  input.value = {
    year: input.value.year,
    month: input.value.month,
    day: null,
  };
};
</script>
