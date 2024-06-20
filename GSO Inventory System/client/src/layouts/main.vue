<template>
  <LSLayout class="!relative">
    <div
      class="flex items-center gap-2 bg-page-background px-3 py-1 backdrop-blur-sm"
    >
      <div class="flex flex-auto items-center gap-2">
        <router-link :to="{ name: 'HomePage' }" class="flex items-center gap-2">
          <TImage
            :src="logoSrc"
            class="aspect-square w-10 rounded-full border-light"
          />
          <div class="items-center text-2xl font-bold">
            {{ $system.product_name }}
          </div>
        </router-link>
      </div>
      <div class="flex font-semibold"></div>
    </div>
    <TopNav @resize="(size) => (headerSize = size)" class="bg-page-background">
      <template v-if="!$xl" #prepend>
        <TButton
          icon="menu"
          @click="sideBarShow = true"
          class="rounded-full p-1"
        />
      </template>
    </TopNav>
    <PageContainer
      class="mx-auto flex w-full !max-w-[2500px] justify-start"
      style=""
    >
      <SideBar
        v-if="showLSideBar"
        :headerSize="headerSize"
        v-model:collapsed="systemStore.settings.sidebar.collapsed"
        :wrapperClass="{
          '!transition-all': true,
          '!flex-none': systemStore.settings.sidebar.collapsed,
        }"
        :contentClass="{
          'border-r border-foreground/25 ': true,
          'bg-background': !$xl,
        }"
        :fixed="!$xl"
        :show="sideBarShow"
        :menu="menu"
        :logo="
          authStore.profile?.image?.thumbnails.medium ??
          '/favicons/baguioseal.svg'
        "
        :collapsible="sidebarCollapsible"
        @close="sideBarShow = false"
      />
      <Page
        class="mx-auto w-full min-w-0 max-w-7xl p-3"
        :class="{ '': transitioning }"
      >
        <router-view v-slot="{ Component }">
          <transition
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
            enter-active-class="transition duration-300 delay-300"
            leave-active-class="transition duration-300"
            @before-leave="transitioning = true"
            @after-enter="transitioning = false"
          >
            <component :is="Component" class="mx-auto"> </component>
          </transition>
        </router-view>
      </Page>
      <RtlSideBar
        v-if="showRSideBar"
        :headerSize="headerSize"
        wrapperClass="border-foreground/25"
        :contentClass="{
          'w-80': true,
          'bg-background': !$xl,
        }"
        :fixed="!$xl"
        rtl
        :show="rtlSideBarShow"
        @close="rtlSideBarShow = false"
      />
      <div
        v-if="false"
        class="static z-auto flex flex-auto justify-center transition-colors"
      />
    </PageContainer>
    <Footer class="flex border-t border-foreground/25 bg-page-background p-0">
      <PageFooter v-if="showFooter" class="mx-auto" />
      <div
        v-else
        class="flex min-h-16 w-full items-center justify-center gap-1"
      >
        <div class="flex items-center gap-1">
          <TIcon name="copyright" size="sm" />
          <span> 2024 Copyright: City Government of Baguio </span>
        </div>
      </div>
    </Footer>
    <UpScroll />
  </LSLayout>
</template>

<script setup>
import { computed, defineAsyncComponent, reactive, ref, watch } from "vue";
import { useSystemStore, useAuthStore } from "@/stores";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
import { useGuard } from "@/plugins/composables";
import { Helpers } from "@/scripts";

const $router = useRouter();
const $guard = useGuard();
const route = useRoute();

const LSLayout = defineAsyncComponent(() => import("./lockScreenLayout.vue"));
const TopNav = defineAsyncComponent(() => import("./topNav/index.vue"));
const SideBar = defineAsyncComponent(() => import("./sidebar/main.vue"));
const RtlSideBar = defineAsyncComponent(() => import("./sidebar/rMain.vue"));
const UpScroll = defineAsyncComponent(() => import("./upScroll.vue"));
const PageFooter = defineAsyncComponent(() => import("./footer/expanded.vue"));

const systemStore = useSystemStore();
const authStore = useAuthStore();

const $screen = useBreakpoints({
  ...breakpointsTailwind,
  "3xl": 1920,
  "4xl": 2560,
  "5xl": 3840,
});
const $lg = $screen.greaterOrEqual("lg");
const $xl = $screen.greaterOrEqual("xl");

const menu = reactive([
  {
    title: "Employees",
    links: [
      {
        to: { name: "employee" },
        label: "Employee List",
        description: "Employee List",
        icon: "table",
      },
      {
        to: { name: 'employee-create' },
        label: 'New Employee',
        description: '',
        icon: "add"
      }
    ],
  },
  {
    title: "ARE",
    hidden: false,
    links: [
      {
        to: { name: "par" },
        label: "ARE List",
        description: "ARE List",
        icon: "table",
      },
      {
        to: { name: 'par-create' },
        label: 'New ARE',
        description: '',
        icon: "add"
      }
    ],
  },
  {
    title: "Settings",
    hidden: computed(() => !permitted("settings-genders")),
    links: [
      {
        to: { name: "settings-genders" },
        label: "Genders",
        description: "Gender management page",
        icon: "transgender",
        hidden: computed(() => !permitted("settings-genders")),
      },
    ],
  },
  {
    title: "Administrative Settings",
    hidden: computed(
      () => !(permitted("settings-users") || permitted("settings-roles"))
    ),
    links: [
      {
        to: { name: "settings-users" },
        label: "Users",
        description: "User Management",
        icon: "manage_accounts",
        hidden: computed(() => !permitted("settings-users")),
      },
      {
        to: { name: "settings-roles" },
        label: "User Roles",
        description: "User Roles Management",
        icon: "admin_panel_settings",
        hidden: computed(() => !permitted("settings-roles")),
      },
      {
        to: { name: "settings-permissions" },
        label: "Permissions",
        description: "Permissions Management",
        icon: "security",
        hidden: computed(() => !permitted("settings-permissions")),
      },
      {
        to: { name: "privacy-settings" },
        label: "Privacy Policy",
        description: "Privacy Policy Management",
        icon: "policy",
        hidden: computed(() => !permitted("privacy-settings")),
      },
      {
        to: { name: "settings-logs" },
        label: "Logs",
        icon: "history",
        hidden: computed(() => !permitted("settings-logs")),
      },
    ],
  },
]);

const headerSize = ref({});
const sideBarShow = ref(false);
const sidebarCollapsible = ref(true);
const rtlSideBarShow = ref(false);
const transitioning = ref(false);

const logoSrc = computed(
  () => `${Helpers.stripSlashes(import.meta.env.VITE_SERVER)}/logo/xs`
);

const showLSideBar = computed(() => {
  let list = ["settings-container"];
  return route.matched.some((r) => list.includes(r.name));
});

const showRSideBar = computed(() => {
  let list = ["settings-container"];
  return route.matched.some((r) => list.includes(r.name));
});

const showFooter = computed(() => {
  let list = ["HomePage"];
  return route.matched.some((r) => list.includes(r.name));
});

const permitted = (routeName, options = {}) => {
  let perms = $router.resolve(Object.assign({}, { name: routeName }, options))
    ?.meta?.permissions;
  if (perms == (null || undefined)) {
    return true;
  }
  return $guard.can(perms);
};

watch(route, (val) => {
  sideBarShow.value = false;
});

watch($screen["4xl"], (val) => {
  if (val) {
    systemStore.settings.sidebar.collapsed = false;
  }
  sidebarCollapsible.value = !val;
});
</script>
