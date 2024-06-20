<template>
  <teleport to="body">
    <transition
      enter-from-class="opacity-0 blur-md"
      leave-to-class="opacity-0 blur-md"
      enter-active-class="transition duration-300 delay-300"
      leave-active-class="transition duration-300"
    >
      <div
        v-if="!!cookie.id && cookie.accept === false"
        class="fixed bottom-10 right-10 z-[9999] flex min-h-32 w-screen-95 max-w-sm items-center gap-5 rounded-lg border border-dark bg-light/75 px-3 py-2 text-dark backdrop-blur-sm"
      >
        <div class="mx-auto grid w-full max-w-5xl gap-3 text-center text-lg">
          <span v-html="cookie.prompt" class="prose prose-sm" />
          <div class="flex items-center justify-center gap-2 text-base">
            <TButton
              v-if="route.name != 'privacy-policy'"
              label="Privacy Policy"
              class="rounded-lg border-dark bg-dark bg-glossy px-3 py-1 text-light"
              :to="{ name: 'privacy-policy' }"
              target="_blank"
            />
            <TButton
              label="Accept All"
              class="rounded-lg px-3 py-1"
              @click="cookie.acceptPolicy()"
            />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { usePrivacyStore } from "@/stores";

const route = useRoute();
const cookie = usePrivacyStore();
</script>
