<template>
  <div
    class="flex items-stretch divide-x divide-transparent border border-transparent transition-colors hover:divide-foreground/25 hover:border-foreground/25"
  >
    <ActionButton
      class="rounded-l-[inherit] rounded-r-none"
      @click="
        editor?.chain().focus().toggleHighlight({ color: currentColor }).run()
      "
    >
      <div class="pointer-events-none grid">
        <TIcon name="brush" />
        <div
          class="absolute inset-x-0 bottom-0 min-h-1"
          :style="{ backgroundColor: currentColor }"
        />
      </div>
    </ActionButton>
    <TPopover
      btnClass="h-full rounded-[inherit]"
      icon="expand_more"
      iconSize="sm"
    >
      <template #default="{ close }">
        <div class="">
          <ColorPicker
            :color="selectedColor"
            :visible-formats="['hex']"
            default-format="hex"
            @colorChange="onColorChange"
            class="min-w-64"
          >
            <template #copy-button><span></span></template>
          </ColorPicker>
          <div class="flex items-center px-3 pb-3">
            <TInput v-model="selectedColor" label="Color" class="flex-auto">
              <template #after>
                <TButton
                  label="Ok"
                  class="rounded-lg bg-primary px-3 py-2 text-light"
                  @click="setColor(), close()"
                />
              </template>
            </TInput>
          </div>
        </div>
      </template>
    </TPopover>
  </div>
</template>
<script setup>
import { defineAsyncComponent, ref } from "vue";
import { ColorPicker } from "vue-accessible-color-picker";

const ActionButton = defineAsyncComponent(() =>
  import("./utils/actionButton.vue")
);
const props = defineProps({
  editor: Object,
});

const currentColor = ref("#ffff00");
const selectedColor = ref("#ffff00");

const onColorChange = (e) => {
  selectedColor.value = e.cssColor;
};

const setColor = () => {
  currentColor.value = selectedColor.value;
  props.editor
    ?.chain()
    .focus()
    .toggleHighlight({ color: currentColor.value })
    .run();
};
</script>

<style lang="scss">
.vacp-color-picker {
  @apply bg-inherit text-inherit;
  .vacp-copy-button {
    @apply hidden;
  }
  .vacp-color-space {
    @apply rounded-sm ring-1;
  }
  .vacp-range-input-group {
    @apply col-span-2;
  }
  .vacp-color-inputs {
    @apply hidden;
  }
}
</style>
