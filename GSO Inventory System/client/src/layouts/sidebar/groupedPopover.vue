<template>
  <div>
    <TPopover
      placement="right-start"
      arrow
      class="w-full"
      btnClass="w-full rounded-lg "
    >
      <template #button>
        <div
          class="pointer-events-none flex items-center gap-1 px-3 py-1"
          :class="{ ..._btnClass, 'router-link-active': hasActive }"
        >
          <TIcon
            v-if="!!icon"
            :name="icon"
            :type="iconType"
            :class="_iconClass"
          />
          <template v-if="!!btnLabel">
            <div class="flex-auto text-start font-semibold">{{ btnLabel }}</div>
            <TIcon name="chevron_right" />
          </template>
        </div>
      </template>
      <template #default="{ close }">
        <div class="grid w-screen-95 max-w-xs px-2 py-1">
          <div class="text-gray-400">
            {{ label }}
          </div>
          <template v-for="sub in menu.sub" :key="sub">
            <ActionButton
              v-if="!!sub.to"
              :label="sub.label"
              :to="sub.to"
              :icon="sub.icon"
              @click="close()"
            />
            <ActionButton
              v-else-if="!!sub.action"
              :label="sub.label"
              :icon="sub.icon"
              @click="sub.action, close()"
            />
            <GroupedPopover
              v-else-if="!!sub.sub"
              :icon="sub.icon"
              :btnLabel="sub.label"
              :menu="sub"
            />
          </template>
        </div>
      </template>
    </TPopover>
    <TToolTip v-if="!!tooltip" :position="tooltipPosition" arrow>
      {{ tooltip }}
    </TToolTip>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { Helpers } from "@/scripts";

const route = useRoute();

const ActionButton = defineAsyncComponent(() => import("./actionButton.vue"));
const GroupedPopover = defineAsyncComponent(() =>
  import("./groupedPopover.vue")
);

const props = defineProps({
  label: String,
  menu: Object,
  btnLabel: {
    type: String,
    default: null,
  },
  btnClass: {
    type: [Object, String],
    default: () => [],
  },
  icon: {
    type: String,
    default: null,
  },
  iconType: {
    type: String,
    default: "outlined",
  },
  iconClass: {
    type: [Object, String],
    default: () => [],
  },
  tooltip: {
    type: String,
    default: null,
  },
  tooltipPosition: {
    type: String,
    default: "right",
  },
});

const hasActive = computed(() => checkActive());
const _iconClass = computed(() => Helpers.classFormatter(props.iconClass));
const _btnClass = computed(() => Helpers.classFormatter(props.btnClass));

const checkActive = () => {
  if (!!props.menu && !!props.menu.sub) {
    return checkActiveSub(props.menu.sub);
  }
  return false;
};

const checkActiveSub = (sub) => {
  return sub.some(
    (v) => v.to?.name == route.name || (!!v.sub && checkActiveSub(v.sub))
  );
};
</script>

<style scoped lang="scss">
.router-link-active,
:deep(.router-link-active) {
  @apply text-primary;
}
.router-link-exact-active,
:deep(.router-link-exact-active) {
  @apply border-primary/25 bg-primary/10;
}
</style>
