<template>
  <div class="flex items-center gap-1">
    <template v-for="m in lMenu" :key="`menu_${m.label}`">
      <TButton
        v-if="m.show"
        class="rounded-lg px-3 py-1 font-semibold"
        v-bind="Object.assign({}, !!m.to ? { to: m.to } : {})"
        @click="!!m.action ? m.action() : null"
      >
        <div class="pointer-events-none flex items-center gap-1 py-1">
          <div v-if="!!m.icon" class="flex items-center justify-center px-1">
            <TIcon :name="m.icon" />
          </div>
          <div v-if="!!m.label" class="flex-auto text-start leading-none">
            {{ m.label }}
          </div>
        </div>
      </TButton>
    </template>
    <TPopover
      v-if="rMenu.length > 0"
      :btnClass="[
        'rounded-lg px-3 py-2',
        moreActive && 'router-link-exact-active',
      ]"
      placement="bottom-start"
    >
      <template #button>
        <div class="flex items-center gap-1">
          <div class="flex-auto font-semibold">
            {{ lMenu.length <= 0 ? label ?? "More" : "More" }}
          </div>
          <TIcon name="arrow_drop_down" />
        </div>
      </template>
      <template #default="{ close }">
        <div class="grid min-w-52">
          <template v-for="m in rMenu" :key="`rmenu_${m.label}`">
            <TButton
              label="Blood Chemistry"
              class="px-3 py-2"
              v-bind="Object.assign({}, !!m.to ? { to: m.to } : {})"
              @click="!!m.action ? m.action() : null, close()"
            >
              <div
                class="pointer-events-none flex items-center gap-2 text-start font-semibold"
              >
                <div
                  v-if="!totallyNoIcons"
                  class="flex items-center justify-center border-r border-foreground/25 pr-3"
                >
                  <TIcon :name="m.icon" />
                </div>
                <div class="flex-auto">
                  {{ m.label }}
                </div>
              </div>
            </TButton>
          </template>
        </div>
      </template>
    </TPopover>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const props = defineProps({
  menu: Object,
  label: {
    type: String,
    default: null,
  },
  maxItems: {
    type: Number,
    default: 5,
  },
});

const winWidth = ref(0);

const lMenu = computed(() => {
  let result = [...props.menu];
  result = result.filter((r) => r.show && r.breakpoint <= winWidth.value);
  return result.slice(0, props.maxItems);
});

const rMenu = computed(() => {
  let labels = lMenu.value.map((m) => m.label);
  let result = props.menu.filter((m) => m.show && labels.indexOf(m.label) < 0);
  return result;
});

const totallyNoIcons = computed(() => !props.menu.some((m) => !!m.icon));
const moreActive = computed(() => {
  let rNames = rMenu.value.filter((m) => !!m.to).map((m) => m.to.name);
  return route.matched.some((r) => rNames.indexOf(r.name) > -1);
});

const onWindowResize = (e) => {
  winWidth.value = e.target.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", onWindowResize);
  winWidth.value = window.innerWidth;
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onWindowResize);
});
</script>

<style scoped>
.router-link-exact-active,
:deep(.router-link-exact-active) {
  @apply bg-primary/25;
}
</style>
