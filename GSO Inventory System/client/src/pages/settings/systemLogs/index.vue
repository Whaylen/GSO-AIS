<template>
  <div class="relative flex flex-col gap-5">
    <LevelFilter
      :levels="headerLevels"
      :summary="summary"
      v-model:filters="filters"
      @update:filters="onFilter"
      :filterable="!!input.day"
    />
    <DateFilter v-model="input" @update:modelValue="onDateFilter">
      <SysLogPreviewer />
    </DateFilter>
    <div v-if="input.day == null" class="min-h-screen-65 overflow-x-auto">
      <Overview
        :levels="headerLevels"
        :logs="logs"
        :month="input.month == null ? null : input.month * 1"
        v-model:summary="summary"
        @month="onMonth"
        @day="onDay"
      />
    </div>
    <DayLogs
      v-else
      :levels="headerLevels"
      :logs="logs"
      @view="onDataView"
      v-model:pagination="pagination"
      @paginate="getLogs"
      class="min-h-screen-75"
    />
    <TInnerLoading :active="loading" :text="loadingMessage" />

    <TDialog
      v-model="modal.show"
      v-slot="{ close }"
      position="right"
      transition="slide-left"
    >
      <DataViewer :data="modal.data" @close="close" class="rounded-r-none" />
    </TDialog>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, inject, onMounted, ref } from "vue";
import dayjs from "dayjs";
import { useSearcher } from "@/plugins/composables";

const $api = inject("$api");

const Overview = defineAsyncComponent(() => import("./overview.vue"));
const DayLogs = defineAsyncComponent(() => import("./dayLogs.vue"));
const DataViewer = defineAsyncComponent(() => import("./dataViewer.vue"));
const DateFilter = defineAsyncComponent(() => import("./filter/date.vue"));
const LevelFilter = defineAsyncComponent(() => import("./filter/levels.vue"));
const SysLogPreviewer = defineAsyncComponent(() =>
  import("./system/previewer.vue")
);

const loading = ref(false);
const loadingMessage = ref("");

const logs = ref([]);

const input = ref({
  year: dayjs().year(),
  month: null,
  day: null,
});

const modal = ref({
  show: false,
  data: null,
});

const summary = ref([
  {
    total: 0,
    prct: 0,
  },
  {
    total: 0,
    prct: 0,
  },
  {
    total: 0,
    prct: 0,
  },
  {
    total: 0,
    prct: 0,
  },
  {
    total: 0,
    prct: 0,
  },
  {
    total: 0,
    prct: 0,
  },
  {
    total: 0,
    prct: 0,
  },
  {
    total: 0,
    prct: 0,
  },
  {
    total: 0,
    prct: 0,
  },
]);

const filters = ref([1, 2, 3, 4, 5, 6, 7, 8]);

const levels = ref([
  {
    label: "emergency",
    icon: "bug_report",
    color: "#991b1b",
    twColor: "!bg-red-800 !border-red-800",
  },
  {
    label: "alert",
    icon: "campaign",
    color: "#dc2626",
    twColor: "!bg-red-600 !border-red-600",
  },
  {
    label: "critical",
    icon: "heart_broken",
    color: "#be123c",
    twColor: "!bg-rose-700 !border-rose-700",
  },
  {
    label: "error",
    icon: "cancel",
    color: "#ea580c",
    twColor: "!bg-orange-600 !border-orange-600",
  },
  {
    label: "warning",
    icon: "warning",
    color: "#f59e0b",
    twColor: "!bg-amber-500 !border-amber-500",
  },
  {
    label: "notice",
    icon: "error",
    color: "#22c55e",
    twColor: "!bg-green-500 !border-green-500",
  },
  {
    label: "info",
    icon: "info",
    color: "#0284c7",
    twColor: "!bg-sky-600 !border-sky-600",
  },
  {
    label: "debug",
    icon: "support",
    color: "#60a5fa",
    twColor: "!bg-blue-400 !border-blue-400",
  },
]);

const headerLevels = computed(() => [
  {
    label: "all",
    icon: "receipt",
    color: "#8A8A8A",
    twColor: "!bg-zinc-500 !border-zinc-500",
  },
  ...levels.value,
]);

const searchUri = computed(
  () =>
    `/logsy/${input.value.year}${
      !!input.value.month ? "/" + input.value.month : ""
    }${!!input.value.month && !!input.value.day ? "/" + input.value.day : ""}`
);

const { searcher, pagination, readRouteQuery, resetPagination } = useSearcher(
  searchUri,
  {
    appendToUrl: true,
    pagination: {
      sort: "time",
      order: "desc",
    },
  }
);

const getLogs = () => {
  loading.value = true;
  loadingMessage.value = "Fetching logs, please wait...";
  logs.value = [];
  let params = { search: input.value };
  if (!!input.value.day) {
    Object.assign(params, { levels: filters.value });
  }
  searcher(params)
    .then((response) => {
      logs.value = response.data.data;
      if (input.value.day != null) {
        pagination.value.total = response.data.count;
        summary.value = response.data.summary;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const onFilter = (e) => {
  getLogs();
};

const onDateFilter = (e) => {
  input.value = e;
  if (!e.day) {
    filters.value = [1, 2, 3, 4, 5, 6, 7, 8];
  }
  resetPagination();
  getLogs(input.value.year, input.value.month, input.value.day);
};

const onMonth = (e) => {
  input.value.month = e;
  input.value.day = null;
  filters.value = [1, 2, 3, 4, 5, 6, 7, 8];
  resetPagination();
  getLogs();
};

const onDay = (e) => {
  input.value.day = e;
  resetPagination();
  getLogs();
};

const onDataView = (data) => {
  modal.value.data = data;
  modal.value.show = true;
};

onMounted(() => {
  readRouteQuery(input.value, "search");
  if (!!input.value.day) {
    readRouteQuery(filters.value, "levels");
  }
  getLogs(input.value.year);
});
</script>
