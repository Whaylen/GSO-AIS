<template>
  <div
    class="flex items-stretch rounded-lg border border-transparent focus-within:border-foreground/25"
  >
    <ActionButton
      icon="format_list_bulleted"
      class="list rounded-none"
      :active="editor?.isActive('bulletList')"
      @click="editor?.chain().focus().toggleBulletList().run()"
    />
    <TPopover
      icon="expand_more"
      iconSize="xs"
      btnClass="h-full"
      placement="bottom"
    >
      <div class="flex gap-0.5 p-0.5">
        <ActionButton
          class="aspect-square w-10 bg-foreground/5"
          label="none"
          :active="editor?.isActive('bulletList', { class: 'list-none' })"
          @click="editor?.chain().focus().toggleClass('list-none').run()"
        />
        <ActionButton
          class="aspect-square w-10 bg-foreground/5"
          icon="circle"
          iconType="filled"
          :active="
            editor?.isActive('bulletList', {
              class: 'list-disc',
            })
          "
          @click="editor?.chain().focus().toggleClass('list-disc').run()"
        />
        <ActionButton
          class="aspect-square w-10 bg-foreground/5"
          icon="circle"
          :active="editor?.isActive('bulletList', { class: 'list-[circle]' })"
          @click="editor?.chain().focus().toggleClass('list-[circle]').run()"
        />
        <ActionButton
          class="aspect-square w-10 bg-foreground/5"
          icon="square"
          iconType="filled"
          :active="
            editor?.isActive('bulletList', {
              class: 'list-[square]',
            })
          "
          @click="editor?.chain().focus().toggleClass('list-[square]').run()"
        />
      </div>
    </TPopover>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import { BulletList } from "@tiptap/extension-bullet-list";

const ActionButton = defineAsyncComponent(() =>
  import("../utils/actionButton.vue")
);
const props = defineProps({
  editor: Object,
});
</script>
