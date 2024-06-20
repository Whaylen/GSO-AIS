<template>
  <TCard class="relative">
    <TCardHeader>
      <TCardTitle>
        {{ isEdit ? "Update Gender" : "Add Gender" }}
      </TCardTitle>
      <TButton
        icon="close"
        iconSize="sm"
        class="rounded-full p-1"
        @click="emit('close')"
      />
    </TCardHeader>

    <TCardBody>
      <TInput
        :label="editor.name.name"
        v-model="editor.name.value"
        :error="editor.name.error"
        :errorMessage="editor.name.errorMessage"
        innerClass="bg-light text-dark"
        @keyup.enter="saveGender"
      />
      <TTextArea
        :label="editor.description.name"
        v-model="editor.description.value"
        :error="editor.description.error"
        :errorMessage="editor.description.errorMessage"
        innerClass="bg-light text-dark"
      />
    </TCardBody>
    <TCardFooter class="flex items-center justify-end gap-2">
      <TButton
        icon="save"
        iconSize="sm"
        label="Save"
        class="rounded-lg bg-primary bg-glossy px-3 py-1 text-light shadow-md"
        @click="saveGender"
      />
      <TButton
        label="Cancel"
        class="rounded-lg px-3 py-1"
        @click="emit('close')"
      />
    </TCardFooter>
    <TInnerLoading :active="loading" :text="loadingMessage" />
  </TCard>
</template>

<script setup>
import { computed, inject, ref } from "vue";
import { InputField, notify, Helpers } from "@/scripts";

const $api = inject("$api");

const props = defineProps({
  gender: Object,
});

const emit = defineEmits(["update:gender", "close"]);

const editor = ref({
  name: new InputField(props.gender?.name).setName("Name").setRules("required"),
  description: new InputField(props.gender?.description)
    .setName("Description")
    .setRules(""),
});
const loading = ref(false);
const loadingMessage = ref("");

const isEdit = computed(() => !!props.gender?.id);

const saveGender = () => {
  if (validate()) {
    loading.value = true;
    loadingMessage.value = "Saving Gender...";

    const method = isEdit.value ? "put" : "post";
    const url = isEdit.value ? `/gender/${props.gender.id}` : "/gender";
    $api[method](url, getPayload())
      .then((response) => {
        emit("update:gender", response.data.data);
        notify({
          title: "Success!",
          type: "positive",
          text: response.data.message,
        });
      })
      .catch((error) => {
        Helpers.onRequestError(error, editor.value);
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const validate = () => {
  const valid = Object.values(editor.value);
  valid.forEach((e) => {
    e.validate();
  });
  return valid.every((e) => !e.error);
};

const getPayload = () => {
  return {
    name: editor.value.name.value,
    description: editor.value.description.value,
  };
};
</script>
