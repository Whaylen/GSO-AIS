<template>
  <TCard class="relative">
    <TCardHeader>
      <TCardTitle> Change Gender State </TCardTitle>
      <TButton
        icon="close"
        iconSize="sm"
        class="rounded-full p-1"
        @click="emit('close')"
      />
    </TCardHeader>

    <TCardBody class="flex flex-col gap-2">
      <p>
        You are about to
        <strong>{{ isActive ? "Disable" : "Enable" }}</strong> the following
        gender:
      </p>
      <ul
        class="rounded-lg border border-foreground/25 bg-foreground/10 px-3 font-bold"
      >
        <li>{{ gender.name }}</li>
      </ul>
      <p>Continue?</p>
    </TCardBody>
    <TCardFooter class="flex items-center justify-end gap-2">
      <TButton
        label="Yes"
        class="rounded-lg bg-primary bg-glossy px-3 py-1 text-light shadow-md"
        @click="toggleGender"
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

const loading = ref(false);
const loadingMessage = ref("");

const isActive = computed(() => !!props.gender?.active);

const toggleGender = () => {
  loading.value = true;
  loadingMessage.value = "Toggling Gender State...";

  $api
    .patch(`/gender/${props.gender.id}`)
    .then((response) => {
      emit("update:gender", response.data.data);
      notify({
        title: "Success!",
        type: "positive",
        text: response.data.message,
      });
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
