<template>
  <component
    :is="tag"
    ref="cardRef"
    class="flex flex-col rounded-2xl border border-foreground/25 bg-background-accent shadow-md after:shadow-slate-700 after:dark:shadow-slate-100"
  >
    <slot></slot>
  </component>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  tag: {
    type: String,
    default: "div",
  },
});

const cardRef = ref(null);

const observer = computed(
  () =>
    new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type == "childList") {
          setStyles(mutation.target);
        }
      }
    })
);

const setStyles = (parentEl) => {
  let children = Array.from(parentEl.children).filter(
    (child) =>
      ["absolute", "fixed"].indexOf(getComputedStyle(child).position) < 0 &&
      ["none"].indexOf(getComputedStyle(child).display < 0)
  );

  children.forEach((child) => {
    child.style.borderRadius = "";
    child.style.borderTopRightRadius = "";
    child.style.borderTopLeftRadius = "";
    child.style.borderBottomLeftRadius = "";
    child.style.borderBottomRightRadius = "";
  });

  if (children.length > 0) {
    let cardStyles = getComputedStyle(parentEl);

    let radii = {
      topRight: `${
        parseFloat(cardStyles.borderTopRightRadius) -
        Math.max(
          parseFloat(cardStyles.borderRightWidth),
          parseFloat(cardStyles.borderTopWidth)
        ) -
        Math.max(
          parseFloat(cardStyles.paddingRight),
          parseFloat(cardStyles.paddingTop)
        )
      }px`,
      topLeft: `${
        parseFloat(cardStyles.borderTopLeftRadius) -
        Math.max(
          parseFloat(cardStyles.borderLeftWidth),
          parseFloat(cardStyles.borderTopWidth)
        ) -
        Math.max(
          parseFloat(cardStyles.paddingLeft),
          parseFloat(cardStyles.paddingTop)
        )
      }px`,
      bottomLeft: `${
        parseFloat(cardStyles.borderBottomLeftRadius) -
        Math.max(
          parseFloat(cardStyles.borderLeftWidth),
          parseFloat(cardStyles.borderBottomWidth)
        ) -
        Math.max(
          parseFloat(cardStyles.paddingLeft),
          parseFloat(cardStyles.paddingBottom)
        )
      }px`,
      bottomRight: `${
        parseFloat(cardStyles.borderBottomRightRadius) -
        Math.max(
          parseFloat(cardStyles.borderRightWidth),
          parseFloat(cardStyles.borderBottomWidth)
        ) -
        Math.max(
          parseFloat(cardStyles.paddingRight),
          parseFloat(cardStyles.paddingBottom)
        )
      }px`,
    };

    let FirstChild = children[0];
    let LastChild = children[children.length - 1];

    FirstChild.style.borderTopRightRadius = radii.topRight;
    FirstChild.style.borderTopLeftRadius = radii.topLeft;
    LastChild.style.borderBottomLeftRadius = radii.bottomLeft;
    LastChild.style.borderBottomRightRadius = radii.bottomRight;
  }
};

watch(cardRef, (val) => {
  setStyles(val);
});

onMounted(() => {
  observer.value.observe(cardRef.value, { childList: true });
});

onBeforeUnmount(() => {
  observer.value.disconnect();
});
</script>
