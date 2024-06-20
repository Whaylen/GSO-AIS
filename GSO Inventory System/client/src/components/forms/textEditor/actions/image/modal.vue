<template>
  <TCard class="max-h-screen-95 w-screen-95 max-w-sm">
    <TCardHeader>
      <TCardTitle> Add Link </TCardTitle>
      <TButton icon="close" class="rounded-full p-1" @click="emit('close')" />
    </TCardHeader>
    <TCardBody>
      <TInput
        v-model="form.src.value"
        :label="form.src.name"
        :error="form.src.error"
        :errorMessage="form.src.errorMessage"
        @keyup.enter="setImage"
      />
      <TInput
        v-model="form.alt.value"
        :label="form.alt.name"
        :error="form.alt.error"
        :errorMessage="form.alt.errorMessage"
        @keyup.enter="setImage"
      />
    </TCardBody>
    <TCardFooter class="flex items-center justify-end">
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
          @click="setImage"
        />
      </div>
    </TCardFooter>
  </TCard>
</template>

<script setup>
import { ref } from "vue";
import { InputField } from "@/scripts";

const props = defineProps({
  editor: Object,
});

const emit = defineEmits(["close"]);

const form = ref({
  src: new InputField().setName("Source").setRules("required|url"),
  alt: new InputField().setName("Alternative description"),
});

const setImage = () => {
  props.editor
    .chain()
    .focus()
    .setImage({ src: form.value.src.value, alt: form.value.alt.value })
    .run();
  emit("close");
};
</script>
