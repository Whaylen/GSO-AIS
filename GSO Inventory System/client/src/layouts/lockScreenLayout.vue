<template>
  <KeepAlive exclude="lockScreen">
    <Layout v-if="!sytemStore.lockScreen.locked" v-bind="$attrs">
      <slot />
    </Layout>
    <LockScreen v-else />
  </KeepAlive>
</template>

<script setup>
import { ref } from "vue";
import { useSystemStore } from "@/stores";
import LockScreen from "./main/lockScreen.vue";

const sytemStore = useSystemStore();
</script>
