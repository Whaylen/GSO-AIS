<template>
  <TPopover
    btnClass="min-w-32 p-0.5 rounded-[inherit] bg-foreground/10"
    placement="bottom"
  >
    <template #button>
      <div class="pointer-events-none flex items-center text-start">
        <div class="flex-auto px-2 font-semibold">
          {{ Helpers.extractHtmlContent(activeHeading?.label ?? "--") }}
        </div>
        <TIcon name="expand_more" />
      </div>
    </template>
    <template #default="{ close }">
      <div class="prose grid min-w-64 p-1 dark:prose-invert">
        <template v-for="option in options" :key="option.label">
          <TButton
            @click="option.action(), close()"
            :class="{ 'bg-primary/25': option.active }"
          >
            <div
              class="pointer-events-none px-3 text-start"
              v-html="option.label"
            />
          </TButton>
        </template>
      </div>
    </template>
  </TPopover>
</template>

<script setup>
import { computed, ref } from "vue";
import { Helpers } from "@/scripts";

const props = defineProps({
  editor: Object,
});

const options = computed(() => [
  {
    label: "<p class='my-1 font-semibold'>Paragraph</p>",
    action: () => props.editor.chain().focus().setParagraph().run(),
    active: props.editor?.isActive("paragraph"),
  },
  {
    label: "<h1 class='m-0'>Heading 1</h1>",
    action: () =>
      props.editor.chain().focus().toggleHeading({ level: 1 }).run(),
    active: props.editor?.isActive("heading", { level: 1 }),
  },
  {
    label: "<h2 class='m-0'>Heading 2</h2>",
    action: () =>
      props.editor.chain().focus().toggleHeading({ level: 2 }).run(),
    active: props.editor?.isActive("heading", { level: 2 }),
  },
  {
    label: "<h3 class='m-0'>Heading 3</h3>",
    action: () =>
      props.editor.chain().focus().toggleHeading({ level: 3 }).run(),
    active: props.editor?.isActive("heading", { level: 3 }),
  },
  {
    label: "<h4 class='m-0'>Heading 4</h4>",
    action: () =>
      props.editor.chain().focus().toggleHeading({ level: 4 }).run(),
    active: props.editor?.isActive("heading", { level: 4 }),
  },
  {
    label: "<h5 class='m-0'>Heading 5</h5>",
    action: () =>
      props.editor.chain().focus().toggleHeading({ level: 5 }).run(),
    active: props.editor?.isActive("heading", { level: 5 }),
  },
  {
    label: "<h6 class='m-0'>Heading 6</h6>",
    action: () =>
      props.editor.chain().focus().toggleHeading({ level: 6 }).run(),
    active: props.editor?.isActive("heading", { level: 6 }),
  },
]);

const activeHeading = computed(() => options.value.find((opt) => opt.active));
</script>
