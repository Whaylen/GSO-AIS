<template>
  <div class="relative py-1 pl-6 leading-none">
    <span
      v-if="outline.sub.length > 0"
      class="absolute left-0 top-0.5 flex aspect-square w-6 items-center justify-center leading-none"
    >
      <TButton
        focusDisabled
        @click="expand = !expand"
        :ripple="{ disabled: true }"
      >
        <div class="pointer-events-none flex items-center gap-2 py-0.5">
          <TIcon
            name="expand_more"
            size="sm"
            class="transition-transform"
            :class="{ '-rotate-90': !expand }"
          />
        </div>
      </TButton>
    </span>
    <TButton
      focusDisabled
      :ripple="{ disabled: true }"
      class="w-full px-1 normal-case hover:underline"
      @click="
        changePage(outline.page, { y: outline.offsetY, x: outline.offsetX })
      "
    >
      <div
        class="pointer-events-none flex items-center gap-2 break-all text-start text-sm"
      >
        {{ outline.title }}
      </div>
    </TButton>
    <TCollapse v-if="outline.sub.length > 0" v-model="expand" class="-ml-3">
      <div class="py-2">
        <div class="border-y border-l border-foreground/25">
          <Outlines
            :outline="outline.sub"
            @changePage="(e) => changePage(e.page, e.offset)"
          />
        </div>
      </div>
    </TCollapse>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";

const Outlines = defineAsyncComponent(() => import("./outlines.vue"));
const props = defineProps({
  outline: Object,
});

const emit = defineEmits(["changePage"]);

const expand = ref(false);

const changePage = (page, offset) => {
  if (!!page) {
    emit("changePage", {
      page,
      offset,
    });
  }
};
</script>
