<template>
  <div class="flex min-h-full flex-col gap-5">
    <div class="text-5xl font-semibold">Privacy Policy</div>
    <router-view v-slot="{ Component }">
      <transition
        enter-from-class="opacity-0 blur-md"
        leave-to-class="opacity-0 blur-md"
        enter-active-class="transition duration-300 delay-300"
        leave-active-class="transition duration-300"
        @before-leave="transitioning = true"
        @after-enter="transitioning = false"
      >
        <component :is="Component" class="flex-auto backdrop-blur-sm">
        </component>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref } from "vue";
const transitioning = ref(false);
</script>
