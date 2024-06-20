<template>
  <table class="w-full">
    <thead>
      <tr class="*:text-center *:capitalize">
        <th>{{ month != null ? "Date" : "Months" }}</th>
        <th v-for="level in levels" :key="level.label" class="w-28">
          <div class="flex items-center justify-center gap-1">
            <TIcon :name="level.icon" size="sm" />
            {{ level.label }}
          </div>
        </th>
      </tr>
    </thead>
    <tbody class="*:transition odd:*:bg-foreground/5 hover:*:bg-foreground/10">
      <template v-if="logs.length <= 0">
        <tr>
          <td
            colspan="100%"
            class="text-center font-semibold italic text-gray-400"
          >
            No Data!
          </td>
        </tr>
      </template>
      <template v-for="(log, index) in logs" :key="index">
        <tr
          class="cursor-pointer text-center"
          @click="
            emit(
              month == null ? 'month' : 'day',
              dayjs(index).format(month == null ? 'M' : 'D')
            )
          "
        >
          <td>
            {{ dayjs(index).format(month !== null ? "MMMM DD" : "MMMM") }}
          </td>
          <template
            v-for="(level, indexx) in levels"
            :key="`${index}_${level.label}`"
          >
            <td>
              <div class="flex items-center justify-center">
                <div
                  class="rounded-full bg-opacity-75 px-3 font-semibold dark:bg-opacity-25"
                  :class="{
                    [level.twColor]: (log[indexx] ?? 0) > 0 || indexx == 0,
                    'text-light': (log[indexx] ?? 0) > 0 || indexx == 0,
                  }"
                >
                  {{ indexx > 0 ? log[indexx] ?? 0 : sumLogs(log) }}
                </div>
              </div>
            </td>
          </template>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import dayjs from "dayjs";
import { useVModel } from "@vueuse/core";
const props = defineProps({
  levels: Object,
  logs: Object,
  summary: Object,
  month: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["update:summary", "month", "day"]);

const _summary = useVModel(props, "summary", emit);
const months = computed(() =>
  Array.from(Array(12).keys(), (x) => dayjs().month(x).format("MMMM"))
);

const sumLogs = (l) => {
  let ctr = 0;
  Object.values(l).forEach((ll) => {
    ctr += ll;
  });
  return ctr;
};

const summarize = () => {
  resetSummary();
  Object.values(props.logs).forEach((log) => {
    props.levels.forEach((level, index) => {
      _summary.value[index].total += log[index] ?? 0;
      _summary.value[0].total += log[index] ?? 0;
    });
  });

  _summary.value.forEach((sum, index) => {
    _summary.value[index].prct =
      _summary.value[index].total > 0
        ? parseFloat(
            (_summary.value[index].total / _summary.value[0].total) * 100
          ).toFixed(2)
        : 0;
  });
};

const resetSummary = () => {
  _summary.value.forEach((sum, index) => {
    _summary.value[index].total = 0;
    _summary.value[index].prct = 0;
  });
};

watch(() => props.logs, summarize);

onMounted(() => {
  summarize();
});
</script>
