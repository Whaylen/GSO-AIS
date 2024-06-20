<template>
  <TCard class="max-h-screen-95 w-screen-95 max-w-lg">
    <TCardHeader>
      <TCardTitle> Sort Policies </TCardTitle>
      <TButton
        icon="close"
        iconSize="sm"
        class="rounded-full p-1"
        @click="emit('close')"
      />
    </TCardHeader>
    <div
      class="flex items-center border-b border-foreground/10 bg-foreground/10 px-2"
    >
      <div class="flex flex-auto items-center gap-1">
        <TPopover
          label="Menu"
          btnClass="px-1 py-0.5 border-b-2 border-transparent hover:border-foreground"
          placement="bottom-start"
          focusDisabled
          v-slot="{ close }"
        >
          <div class="grid w-32">
            <template v-for="m in menu" :key="`${m.type}_${m.label}`">
              <TButton
                v-if="m.type == 'action'"
                class="w-full py-0.5"
                @click="m.action(), close()"
              >
                <div class="pointer-events-none flex items-stretch">
                  <div
                    class="flex aspect-square w-[1.375rem] items-center border-r border-foreground/10 p-1 leading-none"
                  >
                    <TIcon v-if="!!m.icon" :name="m.icon" size="xs" />
                  </div>
                  <div class="flex items-center px-1 leading-none">
                    {{ m.label }}
                  </div>
                </div>
              </TButton>
              <div
                v-else-if="m.type == 'separator'"
                class="border-b border-foreground/25"
              />
            </template>
          </div>
        </TPopover>
      </div>
      <TButton icon="restore" class="rounded-lg" @click="restore" />
    </div>
    <TCardBody class="min-h-screen-45 py-3">
      <Sortable
        :list="modelValue"
        :options="options"
        item-key="id"
        class="grid gap-2"
        ref="sortableRef"
      >
        <template #item="{ element, key }">
          <div
            :data-id="key"
            class="flex select-none items-center gap-1 rounded-md border border-foreground/25 bg-background-accent"
          >
            <div class="flex-auto px-3 py-1">
              <div class="text-lg font-semibold leading-none">
                {{ element.title.value ?? "(No Title)" }}
              </div>
              <div class="text-xs text-gray-400">
                {{ element.id }}
              </div>
            </div>
            <div
              v-if="element.collapsible"
              class="flex items-center justify-center"
            >
              <TIcon name="close_fullscreen" size="xs" class="text-gray-400" />
              <TToolTip arrow class="!z-[1031]">
                <div class="">Collapsible</div>
              </TToolTip>
            </div>
            <div
              class="handle flex cursor-grab items-center justify-center px-2 active:cursor-grabbing"
            >
              <TIcon name="drag_indicator" />
            </div>
          </div>
        </template>
      </Sortable>
    </TCardBody>
    <TCardFooter class="flex items-center justify-end gap-2">
      <TButton
        label="Save"
        icon="save"
        iconSize="sm"
        class="rounded-lg border border-primary bg-primary/25 px-3 py-1"
        @click="sort"
      />
      <TButton
        label="Cancel"
        class="rounded-lg px-3 py-1"
        @click="emit('close')"
      />
    </TCardFooter>
  </TCard>
</template>
<script setup>
import { ref } from "vue";
import { Sortable } from "sortablejs-vue3";
const props = defineProps({
  modelValue: Object,
});
const emit = defineEmits(["update:modelValue", "close"]);

const sortableRef = ref(null);
const options = ref({
  handle: ".handle",
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost",
  chosenClass: "chosen",
  forceFallback: true,
});

const menu = ref([
  {
    type: "action",
    label: "Save",
    icon: "save",
    action: () => sort(),
  },
  {
    type: "action",
    label: "Restore Order",
    icon: "restore",
    action: () => restore(),
  },
  {
    type: "action",
    label: "Reverse Order",
    icon: "sync",
    action: () => reverse(),
  },
  {
    type: "separator",
  },
  {
    type: "action",
    label: "Close",
    icon: "close",
    action: () => emit("close"),
  },
]);

const restore = () => {
  let tmp = props.modelValue.map((item) => item.id);
  sortableRef.value.sortable.sort(tmp, true);
};

const reverse = () => {
  let tmp = sortableRef.value.sortable.toArray();
  sortableRef.value.sortable.sort(tmp.reverse(), true);
};

const sort = () => {
  let tmp = sortableRef.value.sortable.toArray();
  let result = props.modelValue
    .slice()
    .sort((a, b) => tmp.indexOf(a.id) - tmp.indexOf(b.id))
    .map((el, index) => Object.assign(el, { order: index + 1 }));
  emit("update:modelValue", result);
};
</script>

<style scoped lang="scss">
.ghost {
  @apply bg-info/25 transition-colors;
}
.chosen {
  @apply text-info;
}
</style>
