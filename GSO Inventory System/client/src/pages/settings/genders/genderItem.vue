<template>
  <tr
    class="divide-x divide-foreground/25 *:px-2 *:py-1 odd:bg-foreground/5 hover:bg-foreground/10"
  >
    <td>{{ gender.name }}</td>
    <td class="text-sm leading-none">{{ gender.description }}</td>
    <td>
      <div
        class="flex h-full items-center justify-center gap-2"
        :class="{
          'text-positive': gender.active,
          'text-negative': !gender.active,
        }"
      >
        <TIcon :name="gender.active ? 'check' : 'close'" />
      </div>
    </td>
    <td v-if="canEdit || canToggle">
      <div class="flex items-center gap-2">
        <TButton
          v-if="canEdit"
          icon="edit"
          iconSize="sm"
          label="Edit"
          class="rounded-lg bg-positive px-3 py-1 text-light"
          @click="emit('update', gender)"
        />
        <TButton
          v-if="canToggle"
          :icon="gender.active ? 'delete' : 'restore'"
          iconSize="sm"
          class="rounded-lg px-3 py-1"
          :class="{
            'bg-negative text-light': gender.active,
            'bg-warning text-light': !gender.active,
          }"
          @click="emit('toggle', gender)"
        />
      </div>
    </td>
  </tr>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  gender: Object,
  canEdit: {
    type: Boolean,
    default: false,
  },
  canToggle: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update", "toggle"]);
</script>
