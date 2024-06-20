<template>
  <img
    :src="src"
    class="aspect-square rounded-full border-4 border-foreground/25 object-fill transition-all"
  />
</template>

<script setup>
const props = defineProps({
  src: String,
});
</script>
