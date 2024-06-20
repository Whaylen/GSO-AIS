<template>
  <TCard class="max-h-screen-95 w-screen-95 max-w-sm">
    <TCardHeader>
      <TCardTitle> Add Link </TCardTitle>
      <TButton icon="close" class="rounded-full p-1" @click="emit('close')" />
    </TCardHeader>
    <TCardBody>
      <TInput
        v-model="form.link.value"
        :label="form.link.name"
        :error="form.link.error"
        :errorMessage="form.link.errorMessage"
        @keyup.enter="setLink"
      />

      <TInput
        v-model="form.text.value"
        :label="form.text.name"
        :error="form.text.error"
        :errorMessage="form.text.errorMessage"
        @keyup.enter="setLink"
      />
      <div class="flex items-center gap-2">
        <div class="leading-none">Open link in:</div>
        <div class="flex flex-auto items-center gap-2">
          <TRadio
            v-model="form.target"
            label="Current window"
            class="flex items-center !py-1"
            value="_self"
          />
          <TRadio
            v-model="form.target"
            label="New window"
            class="flex items-center !py-1"
            value="_blank"
          />
        </div>
      </div>
    </TCardBody>
    <TCardFooter class="flex items-center justify-end">
      <div v-if="editor.isActive('link')" class="flex-auto">
        <TButton
          label="Remove Link"
          icon="link_off"
          class="rounded-lg bg-warning bg-warning/25 px-2"
          @click="editor.chain().focus().unsetLink().run(), emit('close')"
        />
      </div>
      <div class="flex items-center gap-2">
        <TButton
          label="Cancel"
          class="rounded-lg px-2 py-1"
          @click="emit('close')"
        />
        <TButton
          label="Save"
          icon="save"
          class="rounded-lg bg-primary px-2 text-light"
          @click="setLink"
        />
      </div>
    </TCardFooter>
  </TCard>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { InputField } from "@/scripts";

const props = defineProps({
  editor: Object,
});

const emit = defineEmits(["close"]);

const selectedText = ref(null);
const form = ref({
  link: new InputField(props.editor?.getAttributes("link").href ?? null)
    .setName("URL")
    .setRules("url"),
  text: new InputField().setName("Text to display"),
  target: "_blank",
});

const extractSelectedText = () => {
  let state = props.editor?.view.state;
  let { selection } = state;
  let { from, to } = selection;
  let text = state.doc.textBetween(from, to, " ").trim();
  if (props.editor?.isActive("link")) {
    state.doc.nodesBetween(from, to, (node, offset) => {
      text = node.text;
      props.editor.commands.setTextSelection({
        from: offset,
        to: offset + node.nodeSize,
      });
    });
  }
  return text ?? null;
};

const setLink = () => {
  if (validate()) {
    let state = props.editor?.view.state;
    let { selection } = state;
    let { from, to } = selection;
    props.editor
      ?.chain()
      .focus()
      .setLink({ href: form.value.link.value, target: form.value.target })
      .insertContentAt(
        {
          from: from,
          to: to,
        },
        form.value.text.value.length > 0
          ? form.value.text.value
          : form.value.link.value
      )
      .run();
    emit("close");
  }
};

const validate = () => {
  Object.values(form.value).forEach((item) => {
    if (item instanceof InputField) {
      item.validate();
    }
  });

  return !Object.values(form.value).some((item) => item.error);
};

onMounted(() => {
  selectedText.value = extractSelectedText();
  form.value.text.value = selectedText.value;
});
</script>
