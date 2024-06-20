<template>
  <teleport to="body">
    <transition
      enter-from-class="opacity-0 translate-x-full blur-md"
      leave-to-class="opacity-0 translate-x-full blur-md"
      enter-active-class="transition duration-300 delay-300"
      leave-active-class="transition duration-300"
    >
      <div
        v-if="!offlinePWA.ready"
        class="fixed bottom-20 right-2 flex aspect-square w-8 items-center justify-center rounded-full border-2 border-gray-400 bg-black shadow-md shadow-foreground/25"
      >
        <TIcon name="motion_photos_on" class="animate-spin text-green-700" />
        <TToolTip
          class="w-screen max-w-[16rem] border border-gray-400 bg-black font-semibold text-white"
          position="left"
        >
          Loading assets/modules for offline support.
        </TToolTip>
      </div>
      <!-- <div
        v-else-if="offlinePWA.ready && offlinePWA.confirm"
        class="fixed bottom-20 right-2"
      >
        <TButton
          :icon="isOnline ? 'wifi' : 'wifi_off'"
          class="aspect-square w-8 rounded-full border-2 border-gray-400 bg-black shadow-md shadow-foreground/25"
          :class="{
            'text-sky-500': offlinePWA.ready && isOnline,
            'text-gray-500': !isOnline,
          }"
          @click="offlinePWA.confirm = !offlinePWA.confirm"
        />
      </div> -->
      <div
        v-else-if="offlinePWA.ready && !offlinePWA.confirm"
        class="fixed bottom-14 right-2 z-[9997] rounded-xl border-4 border-gray-400 bg-black px-3 py-2 text-white shadow-md shadow-foreground/25 transition-all"
      >
        <div class="font-bold">Offline Ready!</div>
        <div class="text-sm">This site is ready for offline use!</div>
        <div class="flex items-center gap-2">
          <TButton
            label="Ok"
            class="min-w-[3rem] rounded-md bg-blue-700 px-3 py-1 text-light"
            @click="confirm"
          />
          <div
            class="flex flex-auto items-center justify-end gap-0.5 text-end text-sm font-semibold"
            :class="{
              'text-positive': isOnline,
              'text-negative': !isOnline,
            }"
          >
            <TIcon name="circle" type="filled" size="xs" />
            {{ isOnline ? "Online" : "Offline" }}
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRegisterSW } from "virtual:pwa-register/vue";
import { useSystemStore } from "@/stores";

const systemStore = useSystemStore();
const { offlineReady } = useRegisterSW();

const offlinePWA = computed(() => systemStore.settings.pwa.offline);
const isOnline = computed(() => systemStore.connectivity.online);
const confirm = () => {
  offlinePWA.value.confirm = true;
  offlineReady.value = false;
};
</script>
