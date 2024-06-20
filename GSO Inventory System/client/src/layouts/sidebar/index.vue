<template>
  <teleport to="body" :disabled="!fixed">
    <div
      class="transition-colors"
      :class="{
        ..._wrapperClass,
        'static z-auto flex flex-auto justify-center': !fixed,
        'fixed inset-0 z-[1030] ': fixed,
        'flex justify-end': rtl,
        'bg-foreground/10': fixed && show,
        'pointer-events-none': fixed && !show,
      }"
      @click="emit('close')"
    >
      <transition v-bind="transitionClass">
        <SideBarLayout
          v-if="!fixed || (fixed && show)"
          class=""
          :class="_contentClass"
          :contentClass="menuClass"
          :headerSize="headerSize"
          :rtl="rtl"
          :fixed="fixed"
          @click.stop
          @transitionEnd="(e) => emit('transitionEnd', e)"
        >
          <template v-for="(index, name) in slots" v-slot:[name]="data">
            <slot
              :name="name"
              v-bind="data"
              :close="() => emit('close')"
            ></slot>
          </template>
        </SideBarLayout>
      </transition>
    </div>
  </teleport>
</template>

<script setup>
import {
  computed,
  defineAsyncComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
} from "vue";
import { Helpers } from "@/scripts";

const $modals = inject("modals");
const slots = useSlots();
const props = defineProps({
  headerSize: {
    type: Object,
    default: null,
  },
  rtl: {
    type: Boolean,
    default: false,
  },
  fixed: {
    type: Boolean,
    default: false,
  },
  show: {
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
  menuClass: {
    type: [Object, String],
    default: () => [],
  },
});

const emit = defineEmits(["close", "transitionEnd"]);

const SideBarLayout = defineAsyncComponent(() => import("./sideBarLayout.vue"));

const _ID = ref(Helpers.uniqid("mdl"));
const sidebarLayout = ref(null);

const _wrapperClass = computed(() =>
  Helpers.classFormatter(props.wrapperClass)
);

const _contentClass = computed(() =>
  Helpers.classFormatter(props.contentClass)
);

const transitionClass = computed(() => ({
  enterFromClass: `opacity-0 blur-md ${
    props.rtl ? "translate-x-full" : "-translate-x-full"
  }`,
  leaveToClass: `opacity-0 blur-md ${
    props.rtl ? "translate-x-full" : "-translate-x-full"
  }`,
  enterActiveClass: "transition duration-300",
  leaveActiveClass: "transition duration-300",
}));

watch(
  () => [props.fixed, props.show],
  ([f, s] = val) => {
    if (f && s) {
      Object.assign($modals.value, { [_ID.value]: true });
    } else {
      Object.assign($modals.value, { [_ID.value]: false });
    }
  }
);

watch(
  () => $modals.value[_ID.value],
  (val) => {
    if (!val) {
      emit("close");
    }
  }
);
onMounted(() => {
  Object.assign($modals.value, { [_ID.value]: false });
});
onBeforeUnmount(() => {
  delete $modals.value[_ID.value];
});
</script>
