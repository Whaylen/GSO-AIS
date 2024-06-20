<template>
  <teleport to="body" :disabled="contain">
    <div
      ref="swiper"
      v-bind="$attrs"
      class="pointer-events-none left-1/2 z-[99999] flex aspect-square w-12 -translate-x-1/2 items-center justify-center rounded-full border border-foreground/10 bg-background text-foreground shadow shadow-foreground/25 transition-all duration-75 ease-linear"
      :class="{
        fixed: !contain,
        absolute: contain,
      }"
      :style="{
        top: `${top}px`,
        opacity: opacity,
      }"
    >
      <slot :refreshing="refreshing" :rotation="rotate">
        <TIcon
          v-if="!refreshing"
          name="refresh"
          class="iconRotation"
          :style="{ '--tw-rotate': `${rotate}deg` }"
        />
        <TIcon v-else name="motion_photos_on" class="animate-spin" />
      </slot>
    </div>
  </teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
const props = defineProps({
  contain: {
    type: Boolean,
    default: false,
  },
  distance: {
    type: Number,
    default: 96,
    validator: (val) => val > 0,
  },
  offset: {
    type: Number,
    default: 32,
    validator: (val) => val > 0,
  },
  swipeAreaHeight: {
    type: Number,
    default: 96,
  },
});

const emit = defineEmits(["refresh"]);

const refreshing = ref(false);
const covered = ref(0);
const swiper = ref(null);
const pressed = ref(false);
const onTop = ref(false);
const intersected = ref(false);
const within = ref(false);
const swipes = ref({
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 },
});
const direction = ref({
  up: false,
  down: false,
  left: false,
  right: false,
});

const oldPos = ref({
  x: 0,
  y: 0,
});

const bodyScroll = ref({
  top: 0,
  left: 0,
});

const observer = new IntersectionObserver((e) => {
  intersected.value = e[0].isIntersecting;
});

const parentEl = computed(() => swiper.value?.parentElement ?? null);

const opacity = computed(() => {
  let ratio = covered.value / props.distance;
  return ratio > 1 ? 1 : ratio < 0 ? 0 : ratio;
});

const top = computed(() => {
  let max = props.distance + (pressed.value ? props.offset : 0);
  return Math.ceil(
    covered.value <= 0 ? 0 : covered.value > max ? max : covered.value
  );
});

const rotate = computed(() => {
  return Math.round((opacity.value + Number.EPSILON) * 100) * 3.6;
});

const canPull = computed(
  () => !refreshing.value && onTop.value && intersected.value && within.value
);

const boundingKeys = computed(() => ({
  x: "clientX",
  // x: props.contain ? "screenX" : "clientX",
  y: "clientY",
  // y: props.contain ? "screenY" : "clientY",
}));

const swipeStart = (e) => {
  var touch = e;
  if (typeof e["targetTouches"] !== "undefined") {
    touch = e.targetTouches[0];
  }
  swipes.value.start.x = oldPos.value.x = touch.pageX;
  swipes.value.start.y = oldPos.value.y = touch.pageY;
  pressed.value = true;

  let box = parentEl.value.getBoundingClientRect();
  let elCoords = { y: Math.round(box.top), x: Math.round(box.left) };

  within.value =
    swipes.value.start.y >= elCoords.y &&
    swipes.value.start.y <= elCoords.y + props.swipeAreaHeight;

  bodyScroll.value.top = window.scrollY || document.body.scrollTop;
  bodyScroll.value.left = window.scrollX || document.body.scrollLeft;
};

const swipeEnd = (e) => {
  if (canPull.value) {
    pressed.value = false;
    var touch = e;
    if (typeof e["changedTouches"] !== "undefined") {
      touch = e.changedTouches[0];
    }
    swipes.value.end.x = touch[boundingKeys.value.x];
    swipes.value.end.y = touch[boundingKeys.value.y];
    swipeCheck();
  } else {
    reset();
  }
};

const swipeCheck = () => {
  if (opacity.value >= 1) {
    refreshing.value = true;
    emit("refresh", () => reset());
  } else {
    reset();
  }
};

const swiping = (e) => {
  let touch = e.changedTouches[0];
  let _covered = touch[boundingKeys.value.y] - swipes.value.start.y;
  let bodyScrollTop = window.scrollY || document.body.scrollTop;

  onTop.value = props.contain
    ? parentEl.value.scrollTop == 0
    : bodyScrollTop == 0;

  if (canPull.value) {
    covered.value = _covered;
  } else {
    bodyScroll.value.top = bodyScrollTop;
    bodyScroll.value.left = window.scrollX || document.body.scrollLeft;
  }
  getDirection(touch[boundingKeys.value.x], touch[boundingKeys.value.y]);
};

const getDirection = (dx, dy) => {
  direction.value.right =
    direction.value.down =
    direction.value.left =
    direction.value.up =
      false;
  if (dx > oldPos.value.x) {
    direction.value.right = true;
  }
  if (dy > oldPos.value.y) {
    direction.value.down = true;
  }
  if (dx < oldPos.value.x) {
    direction.value.left = true;
  }
  if (dy < oldPos.value.y) {
    direction.value.up = true;
  }
  oldPos.value.x = dx;
  oldPos.value.y = dy;
};

const reset = () => {
  covered.value = 0;
  refreshing.value = false;
  direction.value.right =
    direction.value.down =
    direction.value.left =
    direction.value.up =
      false;
  within.value = false;
};

const onBodyScroll = (e) => {
  if (canPull.value && props.contain) {
    document.body.scrollTo(bodyScroll.value.left, bodyScroll.value.top);
  }
};

onMounted(() => {
  observer.observe(swiper.value);
  parentEl.value?.addEventListener("touchstart", swipeStart, false);
  parentEl.value?.addEventListener("touchend", swipeEnd, false);
  parentEl.value?.addEventListener("touchmove", swiping, false);
  ["scroll", "touchmove", "mousewheel"].forEach((evt) => {
    document.body.addEventListener(evt, onBodyScroll);
  });
});

onBeforeUnmount(() => {
  observer.unobserve(swiper.value);
  parentEl.value?.removeEventListener("touchstart", swipeStart, false);
  parentEl.value?.removeEventListener("touchend", swipeEnd, false);
  parentEl.value?.removeEventListener("touchmove", swiping, false);
  ["scroll", "touchmove", "mousewheel"].forEach((evt) => {
    document.body.removeEventListener(evt, onBodyScroll);
  });
});
</script>

<style scoped>
.iconRotation {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y))
    rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
    scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
</style>
