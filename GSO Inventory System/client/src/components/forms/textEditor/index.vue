<template>
  <div
    class="relative rounded-md border shadow-md shadow-foreground/25"
    :class="[
      error != null && 'mb-5 ',
      error ? 'border-negative' : 'border-foreground/25',
      disabled && 'cursor-not-allowed !bg-gray-200',
    ]"
  >
    <template v-if="!!editor">
      <div
        class="flex flex-wrap items-center gap-0.5 border-b border-inherit px-2 py-1"
      >
        <div
          v-if="!!label"
          class="border-r border-inherit px-2"
          :class="[error && 'animate-shake text-negative']"
        >
          <span class="font-semibold leading-tight">{{ label }}</span>
        </div>
        <component
          v-for="component in actions"
          :key="component"
          :is="component"
          :editor="editor"
          :disabled="disabled"
          @modal="openModal"
          class="rounded-sm"
        />
      </div>
      <div class="px-3 py-1" :style="{ minHeight: `${height + 8}px` }">
        <EditorContent :editor="editor" :id="id" />
      </div>
    </template>
    <div
      v-if="error != null && errorMessage != null"
      class="absolute inset-x-0 bottom-0 translate-y-full px-2 pt-1 text-[11px] leading-none"
    >
      <transition
        enterFromClass="opacity-0 -translate-y-full"
        leaveToClass="opacity-0 -translate-y-full"
        enterActiveClass="transition duration-300"
        leaveActiveClass="transition duration-300"
      >
        <div
          v-if="error"
          class="absolute left-2 right-0 top-0.5 mt-0.5 text-[11px] font-semibold leading-none"
        >
          <slot name="errorMessage" :error="error" :errorMessage="errorMessage">
            <span
              class="rounded-full border-negative px-1 leading-tight text-negative dark:border dark:bg-negative/75 dark:text-light"
            >
              {{ errorMessage }}
            </span>
          </slot>
        </div>
      </transition>
    </div>
    <TDialog v-model="modal.show">
      <component
        :is="modals[modal.type]"
        :editor="editor"
        @close="modal.show = false"
      />
    </TDialog>
  </div>
</template>

<script setup>
import {
  computed,
  defineAsyncComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Code } from "@tiptap/extension-code";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Document } from "@tiptap/extension-document";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Heading } from "@tiptap/extension-heading";
import { History } from "@tiptap/extension-history";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Italic } from "@tiptap/extension-italic";
import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Strike } from "@tiptap/extension-strike";
import { Text } from "@tiptap/extension-text";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import ResizableImage from "./actions/image/resizable";
import ImageResize from "tiptap-extension-resize-image";
import TextAlign from "@tiptap/extension-text-align";
import { common, createLowlight } from "lowlight";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { Helpers } from "@/scripts";

const props = defineProps({
  modelValue: String,
  rows: {
    type: Number,
    default: 3,
  },
  label: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: null,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  editorClass: {
    type: [String, Array, Object],
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "focus", "blur", "isEmpty"]);

const actions = {
  blockquote: defineAsyncComponent(() => import("./actions/blockq.vue")),
  bold: defineAsyncComponent(() => import("./actions/bold.vue")),
  italic: defineAsyncComponent(() => import("./actions/italic.vue")),
  strike: defineAsyncComponent(() => import("./actions/strikeThrough.vue")),
  orderedList: defineAsyncComponent(() => import("./actions/orderedList.vue")),
  bulletList: defineAsyncComponent(() => import("./actions/bulletList.vue")),
  heading: defineAsyncComponent(() => import("./actions/heading.vue")),
  textAlign: defineAsyncComponent(() =>
    import("./actions/textAlign/index.vue")
  ),
  hr: defineAsyncComponent(() => import("./actions/hr.vue")),
  subscript: defineAsyncComponent(() => import("./actions/subscript.vue")),
  superscript: defineAsyncComponent(() => import("./actions/superscript.vue")),
  highlight: defineAsyncComponent(() => import("./actions/highlight.vue")),
  textColor: defineAsyncComponent(() => import("./actions/textColor.vue")),
  link: defineAsyncComponent(() => import("./actions/link/toggle.vue")),
  image: defineAsyncComponent(() => import("./actions/image/toggle.vue")),
  codeBlock: defineAsyncComponent(() => import("./actions/codeBlock.vue")),
};

const modals = {
  link: defineAsyncComponent(() => import("./actions/link/modal.vue")),
  image: defineAsyncComponent(() => import("./actions/image/modal.vue")),
};

const id = ref(Helpers.uniqid());
const hasFocus = ref(false);
const editor = ref(null);
const modal = ref({
  show: false,
  type: "",
});

// (initial height) * (No. of rows) + (top and bottom padding) + (top and bottom border)
const height = computed(
  () => 25.59 * (props.rows <= 0 ? 1 : props.rows) + 8 + 2
);

const isEmpty = computed(
  () => editor.value?.state.doc.textContent.trim().length <= 0
);

const onEditorUpdate = () => {
  let content = editor.value.getHTML();
  let _isEmpty = editor.value?.state.doc.textContent.trim().length <= 0;
  emit("update:modelValue", _isEmpty ? null : content);
};

const openModal = (type) => {
  modal.value.type = type;
  modal.value.show = true;
};

watch(
  () => props.modelValue,
  (val) => {
    let isSame = editor.value?.getHTML() === val;
    if (!isSame) {
      editor.value.commands.setContent(val, false);
    }
  }
);

watch(hasFocus, (val) => {
  emit(val ? "focus" : "blur");
});

watch(isEmpty, (val) => {
  emit("isEmpty", val);
});

watch(
  () => props.disabled,
  (val) => {
    editor.value.setOptions({ editable: !val });
  }
);

onMounted(() => {
  let lowlight = createLowlight(common);

  let BulletListCustom = BulletList.extend({
    addAttributes() {
      return {
        class: {
          default: "list-disc marker:text-foreground",
        },
      };
    },
    addCommands() {
      return {
        ...this.parent?.(),
        toggleClass:
          (className) =>
          ({ commands, chain }) => {
            if (!this.editor.isActive(this.name)) {
              return chain().toggleBulletList().updateAttributes(this.name, {
                class: className,
              });
            }

            if (!this.editor.isActive(this.name, { class: className })) {
              return commands.updateAttributes(this.name, {
                class: className,
              });
            }
          },
      };
    },
  });

  editor.value = new Editor({
    extensions: [
      Blockquote,
      Bold,
      Code,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Document,
      Dropcursor,
      Heading,
      History,
      HorizontalRule,
      Italic,
      ListItem,
      BulletListCustom.configure({
        HTMLAttributes: {
          class: "marker:text-foreground",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "marker:text-foreground",
        },
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: "my-3 first:mt-0 last:mb-0",
        },
      }),
      Strike,
      Text,
      ResizableImage.configure({
        inline: true,
      }),
      Gapcursor,
      HardBreak,
      // .extend({
      //   addKeyboardShortcuts() {
      //     return {
      //       Enter: () => editor.value.commands.setHardBreak(),
      //     };
      //   },
      // }),
      Superscript,
      Subscript,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editable: !props.disabled,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-zinc outline-none max-w-none",
        style: `min-height: ${height.value}px`,
      },
    },
    content: props.modelValue,
    onUpdate: () => onEditorUpdate(),
    onFocus: () => {
      hasFocus.value = true;
    },
    onBlur: () => {
      hasFocus.value = false;
    },
  });
});

onBeforeUnmount(() => {
  editor.value.destroy();
});
</script>

<style lang="scss">
.image-resizer {
  display: inline-flex;
  position: relative;
  flex-grow: 0;
  .resize-trigger {
    position: absolute;
    right: -6px;
    bottom: -9px;
    opacity: 0;
    transition: opacity 0.3s ease;
    color: #3259a5;
  }
  &:hover .resize-trigger {
    opacity: 1;
  }
}
</style>
