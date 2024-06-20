<template>
  <TCard class="relative w-screen-95 max-w-sm">
    <TCardHeader>
      <TCardTitle class="flex items-center gap-2">
        <TIcon name="warning" class="text-negative" />
        Delete Log File?
      </TCardTitle>
      <TButton icon="close" class="rounded-full p-1" />
    </TCardHeader>
    <TCardBody>
      You are about to delete the systems log file. This action is irreversable,
      make sure that you have made a backup before proceeding.
    </TCardBody>
    <TCardFooter class="flex items-stretch justify-end gap-2">
      <TButton
        label="I Understand! Delete the file!"
        class="rounded-lg border border-negative bg-negative/10 bg-glossy px-3 py-1"
        @click="deleteLog"
      />
      <TButton
        label="Cancel"
        class="rounded-lg px-3 py-1"
        @click="emit('close')"
      />
    </TCardFooter>
    <TInnerLoading :active="loading" />
  </TCard>
</template>

<script setup>
import { inject, ref } from "vue";
import { notify } from "@/scripts";

const $api = inject("$api");

const emit = defineEmits(["close", "delete"]);

const loading = ref(false);

const deleteLog = () => {
  loading.value = true;
  $api
    .delete("/log/system")
    .then((response) => {
      notify({
        title: "Sucess",
        type: "positive",
        text: response.data.message,
      });
      emit("delete");
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
