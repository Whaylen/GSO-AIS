<template>
  <SideBar
    :menuClass="{
      'transition-all': true,
      '!px-1 !py-1': _collapsed && !fixed,
    }"
    :contentClass="{
      ..._contentClass,
      'transition-all': true,
      '!w-[3.25rem]': collapsible && _collapsed && !fixed,
      '!w-80': !_collapsed || fixed,
    }"
    :wrapperClass="{
      ..._wrapperClass,
    }"
    :fixed="fixed"
    @transitionEnd="onTransitionEnd"
  >
    <template #before="{ close }">
      <div
        class="relative flex items-center justify-center py-5 transition-all"
        :class="{ 'pb-10': _collapsed && !fixed }"
      >
        <Avatar
          v-if="!!logo"
          :src="logo"
          :class="{
            'w-12': _collapsed && !fixed,
            'w-24': !_collapsed || fixed,
          }"
        />
        <span
          class="absolute transition-all"
          :class="{
            'right-[calc(100%_-_0.5rem)] top-[calc(100%_-_1rem)] -translate-y-1/2 translate-x-full':
              _collapsed,
            'right-2 top-2': !_collapsed,
          }"
        >
          <TButton
            v-if="!fixed && collapsible"
            icon="keyboard_double_arrow_right"
            class="rounded-md p-1"
            :iconClass="{ transition: true, ' rotate-180': !_collapsed }"
            @click="_collapsed = !_collapsed"
          />
          <TButton
            v-else-if="fixed"
            icon="close"
            class="rounded-full p-1"
            @click="close()"
          />
        </span>
      </div>
    </template>
    <template v-for="m in _menu" :key="m">
      <template v-if="!m.hidden">
        <div
          class="min-h-[1.25rem] whitespace-nowrap text-sm font-bold uppercase text-gray-400 transition-opacity"
          :class="{ 'opacity-0': _collapsed }"
        >
          {{ !transitioning && _collapsed ? "" : m.title }}
        </div>
        <template v-for="link in m.links" :key="link">
          <ActionButton
            v-if="!!link.to && !link.sub"
            :label="!transitioning && _collapsed ? null : link.label"
            :tooltip="!_collapsed ? null : link.label"
            :to="link.to"
            :icon="link.icon"
            class="transition-all"
            :class="{ '!px-2': _collapsed }"
            :labelClass="{
              'transition-all': true,
              'opacity-0': _collapsed,
            }"
          />
          <ActionButton
            v-else-if="!!link.action"
            :label="!transitioning && _collapsed ? null : link.label"
            :tooltip="!_collapsed ? null : link.label"
            :icon="link.icon"
            @click="link.action"
            class="transition-all"
            :class="{ '!px-2': _collapsed }"
            :labelClass="{
              'transition-all': true,
              'opacity-0': _collapsed,
            }"
          />
          <template v-else-if="!!link.sub">
            <GroupedPopover
              v-if="!transitioning && _collapsed"
              :label="link.label"
              :tooltip="link.label"
              :menu="link"
              :icon="link.icon"
              :btnClass="{
                'transition-all': true,
                '!px-2': _collapsed,
              }"
            />
            <Grouped
              v-else
              :open="transitioning ? false : null"
              :label="!transitioning && _collapsed ? null : link.label"
              :tooltip="!_collapsed ? null : link.label"
              :menu="link"
              :to="link.to"
              :icon="link.icon"
              :labelClass="{
                'transition-all': true,
                'opacity-0': _collapsed,
              }"
              :btnClass="{
                'transition-all': true,
                '!px-2': _collapsed,
              }"
              :openIcon="transitioning ? link.icon : 'add'"
              :rightIcon="!transitioning"
            />
          </template>
        </template>
      </template>
    </template>
    <template #after>
      <div
        class="grid py-2 transition-all"
        :class="{ 'px-1': _collapsed, 'px-3': !_collapsed }"
      ></div>
    </template>
  </SideBar>
</template>

<script setup>
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { Helpers } from "@/scripts";
import { useVModel } from "@vueuse/core";

const SideBar = defineAsyncComponent(() => import("./index.vue"));
const Grouped = defineAsyncComponent(() => import("./grouped.vue"));
const Avatar = defineAsyncComponent(() => import("./avatar.vue"));
const GroupedPopover = defineAsyncComponent(() =>
  import("./groupedPopover.vue")
);
const ActionButton = defineAsyncComponent(() => import("./actionButton.vue"));
const props = defineProps({
  menu: Object,
  collapsed: {
    type: Boolean,
    default: false,
  },
  afterMenu: {
    type: Object,
    default: null,
  },
  fixed: {
    type: Boolean,
    default: false,
  },
  wrapperClass: {
    type: [Object, String],
    default: () => [],
  },
  contentClass: {
    type: [Object, String],
    default: () => [],
  },
  logo: {
    type: String,
    default: null,
  },
  collapsible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:collapsed"]);

const transitioning = ref(false);

const _collapsed = useVModel(props, "collapsed", emit);

const _menu = computed(() => filterMenu(props.menu));

const _wrapperClass = computed(() =>
  Helpers.classFormatter(props.wrapperClass)
);

const _contentClass = computed(() =>
  Helpers.classFormatter(props.contentClass)
);

const filterMenu = (m) => {
  let result = [];
  m.forEach((mm) => {
    if (!mm.hidden) {
      let sub = null;
      let links = null;
      if (!!mm.sub && mm.sub.length > 0) {
        sub = { sub: filterMenu(mm.sub) };
      }
      if (!!mm.links && mm.links.length > 0) {
        links = { links: filterMenu(mm.links) };
      }

      result.push(Object.assign({}, mm, sub, links));
    }
  });
  return result;
};

const onTransitionEnd = (e) => {
  if (e.propertyName == "width") {
    transitioning.value = false;
  }
};

watch(
  () => props.fixed,
  (val) => {
    if (val) {
      _collapsed.value = false;
    }
  }
);

watch(
  () => props.collapsible,
  (val) => {
    if (!val) {
      _collapsed.value = false;
    }
  }
);

watch(_collapsed, (val) => {
  transitioning.value = true;
});
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
