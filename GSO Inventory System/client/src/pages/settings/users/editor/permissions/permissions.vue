<template>
  <div class="flex flex-col">
    <div class="flex flex-auto flex-col">
      <TInput
        label="Search"
        v-model="search"
        innerClass="bg-light text-dark pr-0"
        @keyup.enter="searchPermissions(true)"
      >
        <template #append>
          <TButton
            v-if="!!search"
            icon="close"
            iconSize="sm"
            iconClass="text-gray-400"
            class="rounded-full p-1"
            @click="(search = null), searchPermissions(true)"
          />
          <TButton
            icon="search"
            class="h-full rounded-r-lg bg-primary bg-glossy px-5 text-light"
            @click="searchPermissions(true)"
          />
        </template>
      </TInput>
      <PageResultCount
        :count="permissions.length"
        :total="pagination.total"
        :limit="pagination.limit"
        :offset="pagination.offset"
        class="py-1 text-start !font-normal"
      />
      <div class="flex-auto py-2">
        <div class="permissionsWrapper relative grid" ref="permissionsWrapper">
          <template v-if="!_loading && permissions.length <= 0">
            <PageSearchEmpty class="col-span-full" />
          </template>
          <div
            v-for="permission in permissions"
            :key="permission.id"
            class="p-1"
          >
            <div
              class="relative line-clamp-2 flex h-11 select-none items-center gap-2 overflow-hidden rounded-xl border border-foreground/25 bg-glossy px-1 text-sm shadow-md transition-all"
              :class="[
                isSelected(permission) && 'bg-primary text-light',
                isLocked(permission) &&
                  'cursor-not-allowed !bg-info/75 !text-dark',
                !isLocked(permission) &&
                  $guard.can(['users_give-direct-permissions']) &&
                  'cursor-pointer hover:scale-[1.02]',
              ]"
              @click="selectPermission(permission)"
            >
              <FocusHelper
                color="bg-foreground"
                :disabled="
                  isLocked(permission) ||
                  !$guard.can(['users_give-direct-permissions'])
                "
              />
              <TIcon
                :name="
                  isSelected(permission) || isLocked(permission)
                    ? 'check_circle_outline'
                    : 'radio_button_unchecked'
                "
                size="sm"
                :class="[
                  !isLocked(permission) &&
                    !$guard.can(['users_give-direct-permissions']) &&
                    'scale-0',
                ]"
              />
              <div class="flex items-center">
                {{ Helpers.dashToHuman(permission.name) }}
              </div>
            </div>
          </div>
        </div>
        <SizeObserver @resize="onResize" />
      </div>
      <div class="flex items-center justify-center gap-2">
        <PageLimiter
          v-model="pagination.limit"
          @update:modelValue="searchPermissions(false)"
        />
        <TPagination
          ref="paginator"
          v-model="pagination.page"
          v-model:limit="pagination.limit"
          v-model:offset="pagination.offset"
          v-model:totalPage="pagination.pages"
          :total="pagination.total"
          hideEllipsis
          class="justify-center gap-1"
          linkClass="aspect-square w-6 p-1 text-sm leading-none flex items-center justify-center rounded-md"
          @paginate="searchPermissions(false)"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, inject, onMounted, ref } from "vue";
import { useGuard, useSearcher } from "@/plugins/composables";
import { Helpers } from "@/scripts";

const $api = inject("$api");
const $guard = useGuard();

const props = defineProps({
  permissions: Array,
  selected: Array,
  roles: Array,
  loading: {
    type: Boolean,
    default: false,
  },
  loadingMessage: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "update:loading",
  "update:loadingMessage",
  "update:permissions",
  "update:selected",
]);

const { searcher, pagination, resetPagination, readRouteQuery } = useSearcher(
  `/users/permissions`,
  {
    pagination: {
      sort: "name",
      order: "asc",

      column: "name",
    },
  }
);

const paginator = ref(null);
const search = ref();
const permissionsWrapper = ref(null);

const _selected = computed({
  get: () => props.selected,
  set: (val) => emit("update:selected", val),
});

const _loading = computed({
  get: () => props.loading,
  set: (val) => emit("update:loading", val),
});

const _loadingMessage = computed({
  get: () => props.loading,
  set: (val) => emit("update:loadingMessage", val),
});

const locked = computed(() => [
  ...new Set(props.roles.map((item) => item.permissions).flat()),
]);

const isLocked = (permission) => {
  return (
    !!locked.value.find((perm) => perm == permission.id) ||
    !!props.roles.find((role) => role.name == $guard.super)
  );
};

const onResize = (size) => {
  let cols = Math.floor(size.width / 200);
  permissionsWrapper.value.style.setProperty("--columns", cols);
};

const selectPermission = (permission) => {
  if (!isLocked(permission) && $guard.can(["users_give-direct-permissions"])) {
    if (isSelected(permission)) {
      _selected.value = _selected.value.filter((item) => item != permission.id);
    } else {
      _selected.value.push(permission.id);
    }
  }
};

const isSelected = (permission) => {
  return !!_selected.value.find((perm) => perm == permission.id);
};

const searchPermissions = (resetPage = false) => {
  _loading.value = true;
  _loadingMessage.value = "Loading permissions, please wait...";
  if (resetPage) {
    resetPagination();
  }
  searcher({ search: search.value })
    .then((response) => {
      pagination.value.total = response.data.count;
      emit("update:permissions", response.data.data);
    })
    .finally(() => {
      _loading.value = false;
    });
};

onMounted(() => {
  searchPermissions(true);
});
</script>

<style scoped lang="scss">
.permissionsWrapper {
  grid-template-columns: repeat(var(--columns), 1fr);
}
</style>
