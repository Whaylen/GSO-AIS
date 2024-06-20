<template>
  <apexchart
    width="320"
    type="donut"
    :options="options"
    :series="series"
  ></apexchart>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { Helpers } from "@/scripts";
import { useSystemStore } from "@/stores";

const systemStore = useSystemStore();

const props = defineProps({
  levels: Object,
  summary: Object,
});
const options = computed(() => ({
  dataLabels: {
    formatter: (val, opts) => {
      return `${val.toFixed(2)}%`;
    },
  },
  chart: {
    background: "none",
  },
  colors: props.levels.slice(1).map((l) => l.color),
  theme: {
    mode: systemStore.theme.dark ? "dark" : "light",
  },
  labels: props.levels
    .slice(1)
    .map((l) => Helpers.CapitalizeFirstLetter(l.label)),
  legend: {
    position: "bottom",
    onItemClick: {
      toggleDataSeries: false,
    },
    onItemHover: {
      highlightDataSeries: false,
    },
  },
  plotOptions: {
    pie: {
      expandOnClick: false,
      donut: {
        labels: {
          show: true,
          name: {
            show: false,
          },
          total: {
            show: true,
            showAlways: true,
            formatter: function (w) {
              return props.summary[0]?.total;
            },
          },
        },
      },
    },
  },
  tooltip: {
    y: {
      formatter: (val, w) => {
        return props.summary[w.seriesIndex + 1]?.total ?? 0;
      },
    },
  },
}));
const series = ref([]);

watch(
  () => props.summary,
  (val) => {
    series.value = val.slice(1).map((s) => s.prct * 1);
  },
  { deep: true }
);

onMounted(() => {});
</script>
