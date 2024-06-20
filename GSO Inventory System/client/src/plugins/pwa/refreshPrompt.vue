<template>
  <teleport to="body">
    <transition
      enter-from-class="opacity-0 translate-x-full blur-md"
      leave-to-class="opacity-0 translate-x-full blur-md"
      enter-active-class="transition duration-300 delay-300"
      leave-active-class="transition duration-300"
    >
      <div
        v-if="needRefresh"
        class="fixed bottom-16 right-12 z-[9996] rounded-xl border-4 border-gray-400 bg-black px-3 py-2 text-white shadow-md shadow-foreground/25 transition-all"
      >
        <div>New content available, click on reload button to update.</div>
        <div class="flex items-center gap-2">
          <TButton
            label="Relaoad"
            class="rounded-md border border-gray-400 px-3 py-1 text-sm shadow-sm shadow-white/25"
            @click="updateServiceWorker()"
          />
          <TButton
            label="Close"
            class="rounded-md border border-gray-400 px-3 py-1 text-sm shadow-sm shadow-white/25"
            @click="closePrompt"
          />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { useRegisterSW } from "virtual:pwa-register/vue";

const { needRefresh, updateServiceWorker } = useRegisterSW();

const closePrompt = () => {
  needRefresh.value = false;
};
</script>
