<template>
  <Header
    class="relative z-50 flex items-center gap-0.5 border-b border-foreground/25 px-3 backdrop-blur-sm"
    :class="{ '!sticky top-0': systemStore.settings.navbar.fixed }"
  >
    <slot name="prepend" />
    <div class="flex flex-auto items-center gap-1">
      <CollapsibleMenu :menu="menu" label="More" />
    </div>
    <TPopover
      v-if="authStore.isLoggedIn && profileMenu.length > 0"
      :btnClass="[
        'h-10 bg-foreground/10 px-2 py-1 rounded-lg my-1',
        $sm && 'min-w-[12rem]',
      ]"
      contentClass="leading-none"
    >
      <template #button>
        <div class="pointer-events-none flex items-center gap-2">
          <img
            v-if="!!authStore.profile?.image"
            :src="authStore.profile.image.thumbnails.small"
            class="aspect-square w-6 rounded-full object-fill ring-2 ring-light"
          />
          <TIcon v-else name="account_circle" class="ring-2 ring-light" />
          <div v-if="$sm" class="text-start">
            <div
              class="line-clamp-1 text-sm font-semibold uppercase leading-none"
            >
              {{ authStore.profile?.full_name ?? authStore.username }}
            </div>
            <div class="text-xs leading-none">
              {{ authStore.email }}
            </div>
          </div>
        </div>
      </template>
      <template #default="{ close, visible }">
        <template v-if="visible">
          <div class="min-w-[12rem] bg-foreground/25 py-0.5">
            <div v-if="!$sm" class="px-2 py-1 text-start">
              <div
                class="line-clamp-1 text-sm font-semibold uppercase leading-none"
              >
                {{ authStore.profile?.full_name ?? authStore.username }}
              </div>
              <div class="text-xs leading-none">
                {{ authStore.email }}
              </div>
            </div>
          </div>
          <template v-for="m in profileMenu" :key="`profilemenu_${m.label}`">
            <div
              v-if="m.separator"
              class="w-full border-b border-foreground/25"
            ></div>
            <TButton
              v-else-if="m.show"
              class="w-full py-1 font-semibold"
              v-bind="Object.assign({}, !!m.to ? { to: m.to } : {})"
              @click="[!!m.action ? m.action() : null, close()]"
            >
              <div class="pointer-events-none flex items-center gap-1 py-1">
                <div
                  class="flex items-center justify-center border-r border-foreground/25 px-1"
                >
                  <TIcon :name="m.icon" />
                </div>
                <div class="flex-auto text-start leading-none">
                  {{ m.label }}
                </div>
              </div>
            </TButton>
          </template>
          <div class="bg-foreground/25 py-0.5"></div>
        </template>
      </template>
    </TPopover>
    <router-link
      v-else-if="!authStore.isLoggedIn"
      :to="{ name: 'login' }"
      icon="login"
      class="relative my-1 inline-flex h-10 items-center overflow-hidden rounded-lg px-3"
      @click="systemStore.toggleFixedNavbar()"
    >
      <div class="pointer-events-none flex items-center gap-1">
        <div class="flex items-center justify-center">
          <TIcon name="login" />
        </div>
        <div v-if="$md" class="font-semibold leading-tight">Login</div>
      </div>
      <FocusHelper color="bg-foreground" />
    </router-link>
    <TPopover
      v-if="settingsMenu.length > 0"
      btnClass="h-10  px-2 py-1 rounded-lg my-1"
      :closeOnOutsideClick="!switcherShowing"
    >
      <template #button>
        <TIcon name="menu" />
      </template>
      <template #default="{ close }">
        <div class="min-w-48">
          <div class="bg-foreground/25 py-0.5"></div>
          <div class="grid divide-y divide-foreground/25">
            <template
              v-for="m in settingsMenu"
              :key="`settings_menu_${m.label}`"
            >
              <TButton
                v-if="m.show"
                class="w-full py-1 font-semibold"
                v-bind="Object.assign({}, !!m.to ? { to: m.to } : {})"
                @click="
                  [!!m.action ? m.action() : null, !!m.autoClose && close()]
                "
              >
                <div class="pointer-events-none flex items-center gap-1 py-1">
                  <div
                    class="flex items-center justify-center border-r border-foreground/25 px-1"
                  >
                    <TIcon :name="m.icon" />
                  </div>
                  <div class="flex-auto text-start leading-none">
                    {{ m.label }}
                  </div>
                </div>
              </TButton>
            </template>
          </div>
          <div class="bg-foreground/25 py-0.5"></div>
        </div>
      </template>
    </TPopover>
    <slot name="append" />
    <SizeObserver @resize="(e) => emit('resize', e)" />
  </Header>
</template>

<script setup>
import { computed, defineAsyncComponent, inject, ref } from "vue";
import { useRouter } from "vue-router";
import { useSystemStore, useAuthStore } from "@/stores";
import { useGuard } from "@/plugins/composables";

const systemStore = useSystemStore();
const authStore = useAuthStore();
const router = useRouter();
const $guard = useGuard();

const $screen = inject("$screen");
const $sm = $screen.value.greaterOrEqual("sm");
const $md = $screen.value.greaterOrEqual("md");
const $lg = $screen.value.greaterOrEqual("lg");

const CollapsibleMenu = defineAsyncComponent(() =>
  import("./collpasingMenu.vue")
);

const emit = defineEmits(["resize"]);

const switcherShowing = ref(false);

const menu = computed(() => [
  // {
  //   label: "",
  //   icon: "",
  //   show: true,
  //   to: { name: "" },
  //   breakpoint: 1024,
  // }
]);

const profileMenu = computed(() => [
  {
    label: "Profile",
    icon: "person",
    show: true,
    to: { name: "profile" },
  },
  {
    label: "Lock Screen",
    icon: "lock",
    show: !!systemStore.lockScreen.pin,
    action: () => systemStore.lock(),
  },
  {
    label: "Settings",
    icon: "settings",
    show: !!settingsRoute.value,
    to: settingsRoute.value,
  },
  {
    label: "Logout",
    icon: "logout",
    show: true,
    action: () => authStore.logout(),
  },
  {
    separator: true,
  },
  {
    label: "Theme",
    icon: systemStore.theme.dark ? "light_mode" : "dark_mode",
    action: () => systemStore.toggleTheme(false),
    autoClose: false,
    to: null,
    show: true,
  },
  {
    label: "Fixed Nav",
    icon: systemStore.settings.navbar.fixed ? "toggle_on" : "toggle_off",
    action: () => systemStore.toggleFixedNavbar(),
    autoClose: false,
    to: null,
    show: true,
  },
  {
    label: "Privacy Policy",
    icon: "policy",
    to: { name: "privacy-policy" },
    show: true,
  },
]);

const settingsMenu = computed(() => []);

const settingsRoute = computed(() => {
  let _routes = [
    "settings-users",
    "settings-permissions",
    "settings-roles",
    "settings-logs",
  ];
  let _route = null;

  _routes.forEach((item) => {
    if (permitted(item) && !_route) {
      _route = { name: item };
    }
  });

  return _route;
});

const permitted = (routeName, options = {}) => {
  let perms = router.resolve(Object.assign({}, { name: routeName }, options))
    ?.meta?.permissions;
  if (perms == (null || undefined)) {
    return true;
  }
  return $guard.can(perms);
};
</script>
