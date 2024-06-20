<template>
  <div
    class="relative flex h-full max-w-full flex-auto flex-col rounded-2xl"
    :class="[transitioning && 'overflow-hidden']"
  >
    <transition
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition duration-300 delay-300"
      leave-active-class="transition duration-300"
      @before-leave="transitioning = true"
      @after-enter="transitioning = false"
    >
      <template v-if="editor.show">
        <Editor
          :modelValue="editor.data"
          v-model:loading="loading"
          v-model:loadingMessage="loadingMessage"
          @update:modelValue="onRoleUpdate"
          @back="closeEditor"
        />
      </template>
      <template v-else>
        <RolesList
          :roles="roles"
          v-model:loading="loading"
          v-model:loadingMessage="loadingMessage"
          v-model:pagination="pagination"
          v-model:search="searchParams.search"
          @update:search="onSearch"
          @edit="openEditor"
          @delete="(role) => openDialog(role, 'delete')"
        />
      </template>
    </transition>
    <TDialog :modelValue="dialog.show" persistent>
      <Deleter
        v-if="dialog.type == 'delete' && $guard.can(['roles_delete'])"
        v-model:modelValue="dialog.data"
        @delete="onRoleDelete"
        @close="dialog.show = false"
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
import { inject, onMounted, reactive, ref } from "vue";
import { Helpers } from "@/scripts";
import { useGuard, useSearcher } from "@/plugins/composables";
import RolesList from "./list/index.vue";
import Editor from "./editor/index.vue";
import Deleter from "./editor/delete.vue";
import { useRoute } from "vue-router";

const $api = inject("$api");
const $guard = useGuard();

const route = useRoute();
const search = ref("");
const roles = ref([]);
const loading = ref(false);
const loadingMessage = ref("");
const transitioning = ref(false);
const roleDelete = ref(null);

const searchParams = ref({
  search: "",
});
const { searcher, pagination, readRouteQuery } = useSearcher(`/roles`, {
  appendToUrl: true,
  pagination: {
    sort: "name",
    order: "asc",
  },
});

const editor = ref({
  show: false,
  data: null,
});

const dialog = ref({
  show: false,
  data: null,
  type: null,
});

const onSearch = (data) => {
  dialog.value.show = false;
  searchRoles();
};

const searchRoles = () => {
  loading.value = true;
  loadingMessage.value = "Loading roles, please wait...";
  return searcher(searchParams.value)
    .then((response) => {
      pagination.value.total = response.data.count;
      roles.value = response.data.data;
    })
    .finally(() => {
      loading.value = false;
    });
};

const openDialog = (data, type) => {
  dialog.value.data = data;
  dialog.value.type = type;
  dialog.value.show = true;
};

const openEditor = (role) => {
  editor.value.data = role;
  editor.value.show = true;
};

const closeEditor = () => {
  editor.value.data = null;
  loading.value = false;
  editor.value.show = false;
};

const onRoleUpdate = (role) => {
  Helpers.updateModel(roles.value, role);
  loading.value = false;
  editor.value.show = false;
};

const onRoleDelete = (role) => {
  roles.value = roles.value.filter((item) => item.id != role.id);
  loading.value = false;
  dialog.value.show = false;
};

const onRefresh = (done) => {
  searchRoles().finally(() => {
    editor.value.show = false;
    done();
  });
};

onMounted(() => {
  readRouteQuery(searchParams.value);
  searchRoles();
});
</script>
