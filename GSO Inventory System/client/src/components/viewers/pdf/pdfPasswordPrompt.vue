<template>
  <div
    class="mx-auto my-auto flex w-screen-95 max-w-sm flex-col rounded-lg border border-foreground/25 bg-background-accent text-foreground shadow shadow-warning/25"
  >
    <div class="px-3 py-0.5 text-lg font-semibold">Enter Password</div>
    <div class="flex flex-auto flex-col gap-3 overflow-y-auto px-3 py-1">
      <div
        class="flex items-center gap-3 rounded-lg border border-warning bg-warning/25 px-3 py-1"
      >
        <TIcon name="warning" size="lg" />
        <div class="">
          The pdf file is protected. Please enter the document's password to
          continue.
        </div>
      </div>
      <TInput
        :label="editor.password.name"
        v-model="editor.password.value"
        :error="editor.password.error"
        :errorMessage="editor.password.errorMessage"
        :type="type"
        innerClass="bg-light text-dark"
        @keyup.enter="emitPassword"
      >
        <template #append>
          <TButton
            :icon="type == 'text' ? 'visibility_off' : 'visibility'"
            class="rounded-lg px-3 py-1"
            @click="toggleType"
          />
        </template>
      </TInput>
    </div>
    <div class="flex items-center justify-end gap-2 px-3 py-1">
      <TButton
        label="Ok"
        class="rounded-lg border border-primary/25 bg-primary/25 bg-glossy px-3 py-1"
        @click="emitPassword"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { InputField } from "@/scripts";
const props = defineProps({
  callback: Function,
  reason: Number,
});

const type = ref("password");
const editor = ref({
  password: new InputField().setName("Password").setRules("required"),
});

const emitPassword = () => {
  if (editor.value.password.validate()) {
    props.callback(editor.value.password.value);
  }
};

const toggleType = () => {
  type.value = type.value == "password" ? "text" : "password";
};

onMounted(() => {
  if (props.reason > 1) {
    editor.value.password.setError("Invalid Password!");
  }
});
</script>

<style scoped></style>
