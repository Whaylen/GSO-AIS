<template>
  <div class="flex flex-col gap-1">
    <div class="flex-auto">
      <table v-if="!!logs" class="w-full">
        <thead>
          <tr class="*:text-start">
            <th class="w-28">Level</th>
            <th class="w-32">Time</th>
            <th>Module</th>
            <th>Header</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="logs.length <= 0">
            <tr>
              <td colspan="100%" class="text-center italic text-gray-400">
                No logs
              </td>
            </tr>
          </template>
          <template v-for="log in logs" :key="log.id">
            <tr class="transition odd:bg-foreground/5 hover:bg-foreground/10">
              <td>
                <div class="flex">
                  <div
                    class="flex items-center gap-1 rounded-lg bg-rose-700 !bg-opacity-25 px-2 py-0.5 font-semibold capitalize"
                    :class="levels[log.level].twColor"
                  >
                    <TIcon :name="levels[log.level].icon" size="sm" />
                    {{ levels[log.level].label }}
                  </div>
                </div>
              </td>
              <td>{{ dayjs(log.date).format("hh:mm:ss A") }}</td>
              <td>{{ log.module }}</td>
              <td>{{ log.action }}</td>
              <td>
                <div class="flex items-center gap-2">
                  <TButton
                    v-if="!!log.new_data || !!log.old_data"
                    label="View"
                    class="rounded-lg border border-primary bg-primary/25 bg-glossy px-3 py-1 text-xs"
                    @click="
                      emit('view', {
                        new: log.new_data,
                        old: log.old_data,
                      })
                    "
                  />
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div
      v-show="_pagination.pages > 1"
      class="flex items-center justify-center px-3 py-1"
    >
      <TPagination
        :modelValue="_pagination.page"
        v-model:limit="_pagination.limit"
        v-model:offset="_pagination.offset"
        v-model:totalPage="_pagination.pages"
        :total="_pagination.total"
        hideEllipsis
        class="justify-center gap-1"
        linkClass="aspect-square w-6 p-1 text-sm leading-none flex items-center justify-center rounded-md"
        @paginate="onPaginate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import dayjs from "dayjs";
import { useVModel } from "@vueuse/core";

const props = defineProps({
  levels: Object,
  logs: Object,
  pagination: Object,
});

const emit = defineEmits(["update:pagination", "view", "paginate"]);

const _pagination = useVModel(props, "pagination", emit);

const onPaginate = (e) => {
  _pagination.value.page = e.currentPage;
  emit("paginate");
};
</script>
