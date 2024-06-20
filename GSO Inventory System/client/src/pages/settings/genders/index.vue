<template>
  <div
    class="relative flex min-h-full max-w-full flex-auto flex-col gap-5 rounded-2xl"
  >
    <div class="py-3 text-3xl font-bold md:text-5xl">Gender Management</div>
    <div
      class="sticky z-50 rounded-b-lg rounded-t-md border border-foreground/25 bg-background px-2 py-1"
      :class="{
        'top-12': system.settings.navbar.fixed,
        'top-0': !system.settings.navbar.fixed,
      }"
    >
      <div class="flex items-center gap-2">
        <div class="flex flex-auto items-center gap-2">
          <TInput
            label="Search"
            v-model="searchParams.search"
            innerClass="bg-light text-dark pr-0 max-w-72 w-72"
            @keyup.enter="searchGenders"
          >
            <template #append>
              <div class="flex h-full items-center gap-2 p-0.5">
                <TButton
                  v-if="!!searchParams.search"
                  icon="close"
                  iconSize="sm"
                  class="rounded-full p-1"
                  @click="[(searchParams.search = ''), searchGenders()]"
                />
                <TButton
                  icon="search"
                  class="self-stretch rounded-lg bg-primary px-3 py-1 text-light"
                  @click="searchGenders"
                />
              </div>
            </template>
            <template v-if="guard.can('gender_add')" #after>
              <div class="flex items-center gap-2">
                <TButton
                  icon="add"
                  label="Add Gender"
                  class="rounded-lg border border-dark bg-light bg-glossy px-3 py-1 text-dark"
                  focusClass="!bg-dark"
                  :ripple="{
                    color: 'bg-primary',
                  }"
                  @click="openModal(null, 'editor')"
                />
              </div>
            </template>
          </TInput>
        </div>
        <div class="flex items-center justify-end gap-2">
          <TButton
            icon="navigate_before"
            iconSize="sm"
            class="rounded-lg p-1"
            :disabled="pagination.page <= 1"
            @click="onPager(pagination.page - 1)"
          />
          <Pager
            :page="pagination.page"
            :total="pagination.pages"
            @update:page="onPager"
          />
          <TButton
            icon="navigate_next"
            iconSize="sm"
            class="rounded-lg p-1"
            :disabled="pagination.page >= pagination.pages"
            @click="onPager(pagination.page + 1)"
          />
        </div>
      </div>

      <PageResultCount
        :count="genders.length"
        :total="pagination.total"
        :limit="pagination.limit"
        :offset="pagination.offset"
        class="py-1 text-start !font-normal"
      />
    </div>

    <div
      class="flex flex-auto flex-col rounded-lg border border-foreground/25 bg-background"
    >
      <div class="flex-auto">
        <table class="w-full">
          <thead>
            <tr
              class="divide-x divide-foreground/25 border-b border-foreground/25 *:text-start"
            >
              <th class="lg:w-64">
                <SearchableColumn
                  label="Name"
                  columnName="name"
                  v-model:order="pagination.order"
                  :currentColumn="pagination.sort"
                  sortable
                  @sort="sortGenders"
                />
              </th>
              <th>
                <SearchableColumn
                  label="Description"
                  columnName="description"
                  v-model:order="pagination.order"
                  :currentColumn="pagination.sort"
                  sortable
                  @sort="sortGenders"
                />
              </th>
              <th class="lg:w-24">
                <SearchableColumn
                  label="Active"
                  columnName="active"
                  v-model:order="pagination.order"
                  :currentColumn="pagination.sort"
                  sortable
                  @sort="sortGenders"
                />
              </th>
              <th
                class="max-w-40 px-2"
                v-if="guard.can(['gender_edit', 'gender_toggle'])"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-foreground/25">
            <template v-for="gender in genders" :key="`gender_${gender.id}`">
              <GenderItem
                :gender="gender"
                :canEdit="guard.can(['gender_edit'])"
                :canToggle="guard.can(['gender_toggle'])"
                @update="(e) => openModal(e, 'editor')"
                @toggle="(e) => openModal(e, 'toggle')"
              />
            </template>
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-center gap-2 py-2">
        <TPagination
          ref="paginator"
          v-model="pagination.page"
          v-model:limit="pagination.limit"
          v-model:offset="pagination.offset"
          v-model:totalPage="pagination.pages"
          :total="pagination.total"
          class="justify-center gap-1"
          linkClass="aspect-square w-6 p-1 text-sm leading-none flex items-center justify-center rounded-md"
          @paginate="searchGenders"
        />
      </div>
    </div>

    <TInnerLoading :active="loading" :text="loadingMessage" />
    <TDialog
      v-if="guard.can(['gender_add', 'gender_edit', 'gender_toggle'])"
      v-model="modal.show"
      persistent
      v-slot="{ close }"
    >
      <component
        :is="components[modal.type]"
        :gender="modal.data"
        @update:gender="onGenderUpdate"
        class="w-screen-95 max-w-sm"
        @close="close"
      />
    </TDialog>
  </div>
</template>
<script setup>
import { computed, defineAsyncComponent, inject, onMounted, ref } from "vue";
import { useSearcher, useGuard } from "@/plugins/composables";
import { useSystemStore } from "@/stores";
import { Helpers } from "@/scripts";

const GenderItem = defineAsyncComponent(() => import("./genderItem.vue"));

const system = useSystemStore();
const guard = useGuard();

const searchParams = ref({
  search: "",
});
const paginator = ref(null);
const genders = ref([]);
const loadingMessage = ref("");
const modal = ref({
  show: false,
  data: null,
  type: null,
});

const components = computed(() => ({
  editor: defineAsyncComponent(() => import("./editor.vue")),
  toggle: defineAsyncComponent(() => import("./toggle.vue")),
}));

const { searcher, pagination, readRouteQuery, loading } = useSearcher(
  "/user/genders",
  {
    appendToUrl: true,
    pagination: {
      sort: "name",
    },
  }
);

const searchGenders = () => {
  loadingMessage.value = "Fetching genders...";
  searcher(searchParams.value)
    .then((response) => {
      genders.value = response.data.data;
      pagination.value.total = response.data.count;
    })
    .finally(() => {});
};

const openModal = (data, type) => {
  modal.value.data = data;
  modal.value.type = type;
  modal.value.show = true;
};

const onGenderUpdate = (e) => {
  Helpers.updateModel(genders.value, e);
  modal.value.show = false;
};

const onPager = (e) => {
  paginator.value.changePage(e);
};

const sortGenders = (e) => {
  pagination.value.sort = e;
  searchGenders();
};

onMounted(() => {
  readRouteQuery(searchParams.value);
  searchGenders();
});
</script>
