<template>
  <TCard class="h-screen max-h-screen max-w-screen-95">
    <TCardHeader>
      <TCardTitle>Logged Data</TCardTitle>
      <TButton icon="close" class="rounded-full p-1" @click="emit('close')" />
    </TCardHeader>
    <div v-if="!!data.new && !!data.old" class="flex items-center gap-2 px-3">
      <TButton
        v-if="!!data.new"
        label="New Data"
        class="rounded-lg border bg-opacity-25 px-3 py-1"
        :class="{ 'bg-primary': type == 'new' }"
        @click="type = 'new'"
      />
      <TButton
        v-if="!!data.old"
        label="Old Data"
        class="rounded-lg border bg-opacity-25 px-3 py-1"
        :class="{ 'bg-primary': type == 'old' }"
        @click="type = 'old'"
      />
    </div>
    <TCardBody>
      <JsonTreeView
        v-if="type == 'new'"
        :json="JSON.stringify(data.new)"
        :maxDepth="3"
        :colorScheme="dark ? 'dark' : 'light'"
      />
      <JsonTreeView
        v-if="type == 'old'"
        :json="JSON.stringify(data.old)"
        :maxDepth="3"
        :colorScheme="dark ? 'dark' : 'light'"
      />
    </TCardBody>
    <TCardFooter class="flex items-center justify-end gap-1">
      <div class="flex-auto">Showing {{ type }} data.</div>
      <TButton
        label="Close"
        class="rounded-lg px-3 py-1"
        @click="emit('close')"
      />
    </TCardFooter>
  </TCard>
</template>

<script setup>
import "json-tree-view-vue3/dist/style.css";
import { computed, onMounted, ref } from "vue";
import { JsonTreeView } from "json-tree-view-vue3";
import { useSystemStore } from "@/stores";

const systeStore = useSystemStore();

const props = defineProps({
  data: Object,
});

const emit = defineEmits(["close"]);

const type = ref("new");

const dark = computed(() => systeStore.theme.dark);

onMounted(() => {
  type.value = !!props.data.new ? "new" : "old";
});
</script>
