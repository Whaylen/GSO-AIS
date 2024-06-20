<template>
  <div class="relative flex min-h-full flex-auto flex-col rounded-2xl">
    <div class="px-2">
      <div class="py-3 text-3xl font-bold md:text-5xl">Permissions</div>
      <div class="flex flex-col items-center gap-1 md:flex-row">
        <div class="flex-auto"></div>
        <TInput
          label="Search"
          v-model="searchParams.search"
          innerClass="pr-0 overflow-hidden bg-light text-dark"
          @keyup.enter="searchPermissions"
        >
          <template #append>
            <TButton
              v-if="!!searchParams.search"
              icon="close"
              iconSize="sm"
              class="rounded-full"
              @click="(searchParams.search = null), searchPermissions()"
            />
            <TButton
              icon="search"
              class="h-full bg-primary bg-glossy px-3 text-light"
              @click="searchPermissions"
            />
          </template>
        </TInput>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3">
        <div class="col-span-3 md:col-span-1">
          <TButton
            icon="enhanced_encryption"
            label="Add Permission"
            class="rounded-xl border border-dark bg-light px-3 py-1 text-dark shadow-sm transition hover:shadow-md"
            focusDisabled
            @click="openEditor(null, 'update')"
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
            @update:modelValue="searchPermissions"
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
            @paginate="searchPermissions"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-auto flex-col gap-1 p-3">
      <table class="w-full">
        <thead class="hidden md:table-header-group">
          <tr class="border-b border-foreground/25">
            <th class="w-64 px-2 py-0.5 text-start">Name</th>
            <th class="px-2 py-0.5 text-start">Description</th>
            <th class="w-28 px-2 py-0.5 text-start">Actions</th>
          </tr>
          <tr>
            <th colspan="100%">
              <PageResultCount
                :count="permissions.length"
                :total="pagination.total"
                :limit="pagination.limit"
                :offset="pagination.offset"
                class="py-1 text-start !font-normal"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="!loading && permissions.length <= 0">
            <tr>
              <td colspan="100%">
                <PageSearchEmpty />
              </td>
            </tr>
          </template>
          <template v-for="permission in permissions" :key="permission.id">
            <tr
              class="flex flex-col transition-all odd:bg-dark/5 hover:scale-[1.01] hover:bg-dark/10 dark:odd:bg-light/5 dark:hover:bg-light/10 md:table-row"
            >
              <td class="p-1 md:px-3 md:py-2">
                {{ Helpers.dashToHuman(permission.name) }}
              </td>
              <td class="p-1 md:px-3 md:py-2">
                <div class="line-clamp-4 text-xs md:line-clamp-1">
                  {{ permission.description }}
                </div>
              </td>
              <td class="p-1 md:px-3 md:py-2">
                <div class="flex items-center justify-end gap-1">
                  <TButton
                    :icon="$md ? 'edit' : null"
                    :label="$md ? null : 'Edit'"
                    focusClass="bg-primary"
                    class="rounded-lg px-3 py-1 uppercase md:aspect-square md:p-1"
                    @click="openEditor(permission, 'update')"
                  />
                  <TButton
                    :icon="$md ? 'delete' : null"
                    :label="$md ? null : 'Delete'"
                    focusClass="bg-negative"
                    class="rounded-lg px-3 py-1 uppercase md:aspect-square md:p-1"
                    @click="openEditor(permission, 'delete')"
                  />
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="flex items-center justify-center">
      <TPagination
        ref="paginator"
        v-model="pagination.page"
        v-model:limit="pagination.limit"
        v-model:offset="pagination.offset"
        v-model:totalPage="pagination.pages"
        :total="pagination.total"
        class="justify-center gap-1"
        linkClass="aspect-square w-6 p-1 text-sm leading-none flex items-center justify-center rounded-md"
        @paginate="searchPermissions"
      />
    </div>
    <TInnerLoading :active="loading" :text="loadingMessage" />

    <TDialog
      v-model="editor.show"
      persistent
      :position="editor.type == 'searcher' ? 'top' : 'center'"
    >
      <Editor
        v-if="editor.type == 'update'"
        :modelValue="editor.data"
        @update:modelValue="onPermissionUpdate"
        @close="editor.show = false"
      />
      <Delete
        v-else-if="editor.type == 'delete'"
        :modelValue="editor.data"
        @delete="onPermissionDelete"
        @close="editor.show = false"
      />
    </TDialog>

    <TPullToRefresh
      @refresh="onRefresh"
      :contain="false"
      :distance="96"
      :offset="32"
      :swipeAreaHeight="96"
      class="bg-foreground !text-background"
    />
  </div>
</template>

<script setup>
import {
  inject,
  onMounted,
  ref,
  reactive,
  computed,
  defineAsyncComponent,
} from "vue";
import { Helpers } from "@/scripts";
import { useSearcher } from "@/plugins/composables";

const Editor = defineAsyncComponent(() => import("./editor.vue"));
const Delete = defineAsyncComponent(() => import("./delete.vue"));

const $api = inject("$api");
const $screen = inject("$screen");

const $md = $screen.value.greaterOrEqual("md");

const paginator = ref(null);
const permissions = ref([]);
const loading = ref(false);
const loadingMessage = ref("");

const searchParams = ref({
  search: "",
});
const { searcher, pagination, readRouteQuery } = useSearcher(`/permissions`, {
  appendToUrl: true,
  pagination: {
    sort: "name",
    order: "asc",
  },
});

const editor = reactive({
  show: false,
  data: null,
  type: "update", // update or delete
});

const searchPermissions = () => {
  loading.value = true;
  loadingMessage.value = "Searching permissions, please wait...";

  return searcher(searchParams.value)
    .then((response) => {
      pagination.value.total = response.data.count;
      permissions.value = response.data.data;
    })
    .finally(() => {
      loading.value = false;
    });
};

const openEditor = (permission, type) => {
  editor.data = permission;
  editor.type = type;
  editor.show = true;
};

const onPermissionUpdate = (value) => {
  Helpers.updateModel(permissions.value, value);
  editor.show = false;
};

const onPermissionDelete = (value) => {
  permissions.value = permissions.value.filter((item) => item.id != value.id);
  editor.show = false;
};

const onRefresh = (done) => {
  searchPermissions().finally(() => {
    done();
  });
};

onMounted(() => {
  readRouteQuery(searchParams.value);
  searchPermissions();
});
</script>
