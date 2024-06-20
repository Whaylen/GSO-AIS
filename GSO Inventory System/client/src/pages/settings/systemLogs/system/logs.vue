<template>
  <div v-bind="containerProps" style="height: 100%">
    <div v-bind="wrapperProps" style="width: max-content">
      <LogItem
        v-for="item in list"
        :key="item.index"
        :lnWidth="7.7 * (logs.length + '').length + 4"
        :ln="item.index + 1"
        :length="longest"
        style="height: 26px"
      >
        {{ item.data }}
      </LogItem>
    </div>
  </div>
</template>
<script setup>
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
import { useVirtualList } from "@vueuse/core";

const LogItem = defineAsyncComponent(() => import("./logItem.vue"));

const props = defineProps({
  log: {
    type: Array,
    default: [],
  },
});

const logs = computed(() => props.log);
const longest = ref(0);

const { list, containerProps, wrapperProps } = useVirtualList(logs, {
  itemHeight: 26,
});

const getLongest = (l) => {
  let result = 0;
  l.forEach((ll) => {
    if (ll.length > result) {
      result = ll.length;
    }
  });
  return result;
};

onMounted(() => {
  longest.value = getLongest(props.log);
});
</script>
