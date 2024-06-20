<template>
  <SideBar :fixed="fixed">
    <template #before="{ close }">
      <div class="flex items-center justify-end gap-2 px-3 py-5">
        <TButton
          v-if="fixed"
          icon="close"
          class="rounded-full p-1"
          @click="close()"
        />
      </div>
    </template>
    <template v-for="m in menus" :key="m">
      <ActionButton :label="m.label" @click="m.action" />
      <Grouped v-if="!!m.sub" noOpener :menu="m"> </Grouped>
    </template>
  </SideBar>
</template>

<script setup>
import {
  computed,
  defineAsyncComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const SideBar = defineAsyncComponent(() => import("./index.vue"));
const Grouped = defineAsyncComponent(() => import("./grouped.vue"));
const ActionButton = defineAsyncComponent(() => import("./actionButton.vue"));

const props = defineProps({
  fixed: {
    type: Boolean,
    default: false,
  },
});

const menus = computed(() => []);

const mapMenu = (menu) => {
  let result = menu.map((m) => {
    let mm = {
      label: m.label,
      action: () => router.push({ hash: `#${m.name}` }),
    };
    !!m.sub && Object.assign(mm, { sub: mapMenu(m.sub) });
    return mm;
  });
  return result;
};
</script>
