<template>
  <div class="text-lg font-semibold italic text-gray-400">
    <div v-if="!!searchTerm">
      Your search - {{ searchTerm }} - did not match any record.
    </div>
    <div v-else>{{ message ?? "Your search returned empty." }}</div>
    <template v-if="suggestions.length > 0">
      <div class="text-sm">Suggestions:</div>
      <ul class="list-disc pl-4 text-sm font-light">
        <li v-for="suggestion in suggestions" :key="`suggestion_${suggestion}`">
          {{ suggestion }}
        </li>
      </ul>
    </template>
    <slot>
      <div class="flex items-center">
        <TIcon name="sentiment_dissatisfied" size="5xl" />
      </div>
    </slot>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  message: {
    type: String,
    default: null,
  },
  searchTerm: {
    type: String,
    default: null,
  },
  suggestions: {
    type: Array,
    default: () => [
      "Make sure all words are spelled correctly.",
      "Try different keywords.",
      "Try more general keywords.",
    ],
  },
});
</script>
