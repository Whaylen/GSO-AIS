<template>
  <div class="flex flex-col">
    <div class="flex-auto">
      <div class="grid gap-2">
        <div class="grid grid-cols-2 md:grid-cols-3">
          <div class="col-span-3 flex items-center md:col-span-1">
            <TButton
              label="Create New Policy"
              class="rounded-xl border border-dark bg-light px-3 py-1 text-dark shadow-sm transition hover:shadow-md"
              :to="{ name: 'privacy-settings-editor' }"
            />
          </div>
          <div class="flex items-center gap-1 md:justify-center">
            <span class="hidden md:block">Page</span>
            <Pager
              :page="pagination.page"
              :total="pagination.pages"
              @update:page="(e) => paginator?.changePage(e)"
            />
            <PageLimiter
              v-model="pagination.limit"
              @update:modelValue="searchPolicies"
            />
          </div>
          <div class="flex items-center justify-end gap-1">
            <TPagination
              v-model="pagination.page"
              v-model:limit="pagination.limit"
              v-model:offset="pagination.offset"
              v-model:totalPage="pagination.pages"
              :total="pagination.total"
              :maxPages="1"
              hideEllipsis
              hideBoundaryLinks
              class="justify-center gap-1"
              linkClass="aspect-square w-6 p-1 text-sm leading-none flex items-center justify-center rounded-md"
              @paginate="searchPolicies"
            />
          </div>
        </div>
        <PageResultCount
          :count="policies.length"
          :total="pagination.total"
          :limit="pagination.limit"
          :offset="pagination.offset"
          class="py-1 text-start !font-normal"
        />
        <template v-if="!loading && policies.length <= 0">
          <PageSearchEmpty />
        </template>
        <template v-for="policy in policies" :key="policy.id">
          <TButton
            class="rounded-lg border px-3 py-1"
            :class="{
              'border-positive': !!policy.active,
              'border-foreground/25': !policy.active,
            }"
            :to="{
              name: 'privacy-settings-preview',
              params: { id: policy.id },
            }"
          >
            <div class="pointer-events-none flex items-center gap-2 text-start">
              <div class="flex items-center justify-center">
                <TIcon
                  name="privacy_tip"
                  :class="{ 'text-positive': !!policy.active }"
                />
              </div>
              <div class="grid flex-auto">
                <div
                  class="font-semibold"
                  :class="{ 'text-positive': !!policy.active }"
                >
                  {{ Helpers.formatDate(policy.date) }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ Helpers.formatDate(policy.date, null, "h:mm a") }}
                </div>
              </div>
              <div v-if="!!policy.active" class="grid flex-auto">
                <div class="font-semibold text-positive">Active</div>
                <div class="text-xs font-semibold text-gray-400">
                  {{ Helpers.formatDate(policy.active, null, "MM-DD-YYYY") }}
                </div>
              </div>
              <div class="flex items-center justify-center">
                <TIcon
                  name="chevron_right"
                  :class="{ 'text-positive': !!policy.active }"
                />
              </div>
            </div>
          </TButton>
        </template>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <TPagination
        v-model="pagination.page"
        v-model:limit="pagination.limit"
        v-model:offset="pagination.offset"
        v-model:totalPage="pagination.pages"
        :total="pagination.total"
        class="mx-auto justify-center gap-1"
        linkClass="aspect-square w-6 p-1 text-sm leading-none flex items-center justify-center rounded-md"
        @paginate="searchPolicies"
      />
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { useSearcher } from "@/plugins/composables";
import { Helpers } from "@/scripts";

const $api = inject("$api");

const { searcher, pagination, readRouteQuery } = useSearcher(
  "/policy/privacies",
  {
    appendToUrl: true,
    pagination: {
      sort: "date",
      order: "desc",
    },
  }
);

const loading = ref(false);
const policies = ref([]);

const searchPolicies = () => {
  loading.value = true;
  searcher()
    .then((response) => {
      pagination.value.total = response.data.count;
      policies.value = response.data.data;
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  readRouteQuery({});
  searchPolicies();
});
</script>
