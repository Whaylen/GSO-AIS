<template>
  <div class="flex items-center gap-1">
    <label
      :for="id"
      class="group relative leading-none before:absolute before:inset-x-0 before:top-full before:h-0.5 before:bg-gray-400/25"
    >
      <input
        :id="id"
        ref="input"
        :value="p"
        class="w-full bg-foreground/25 px-1 text-center leading-none outline-none"
        :size="size"
        @keydown="onKeyDown"
        @keyup.enter="onKeyup"
        @blur="onBlur"
      />
      <div
        class="absolute left-1/2 top-full h-0.5 w-0 -translate-x-1/2 bg-primary opacity-0 transition-all group-focus-within:w-full group-focus-within:opacity-100"
      />
    </label>
    <span>/</span>
    <span>{{ total }}</span>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { Helpers } from "@/scripts";
const props = defineProps({
  page: Number,
  total: Number,
  emitOnBlur: {
    type: Boolean,
    defalut: true,
  },
});

const emit = defineEmits(["update:page"]);

const p = ref(1);
const _page = ref(1);
const input = ref(null);
const id = computed(() => Helpers.uniqid());
const size = computed(() => `${props.total}`.length);

const onKeyDown = (evt) => {
  if (
    ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].indexOf(evt.key) < 0
  ) {
    let newInput = replaceSelection(evt, evt.key);
    let parsed = newInput * 1;
    if (newInput == "") {
      p.value = newInput;
    } else if (isInt(parsed)) {
      p.value = parsed == 0 ? 1 : parsed;
    }
    evt.preventDefault();
  }
};

const onKeyup = () => {
  setPage();
};
const onBlur = () => {
  setPage(true);
};

const setPage = (blurrable = false) => {
  if (
    p.value > props.total ||
    p.value < 1 ||
    (blurrable && !props.emitOnBlur)
  ) {
    p.value = _page.value;
  } else {
    _page.value = p.value;
    emit("update:page", _page.value);
  }
};

const replaceSelection = (evt, input) => {
  let _input = input;
  if (["Backspace", "Delete", "Enter"].indexOf(input) > -1) {
    _input = "";
  }
  let start = evt.target.selectionStart;
  let end = evt.target.selectionEnd;
  let val = `${evt.target.value}`;
  if (start == end) {
    if (input == "Backspace") {
      start -= 1;
    } else if (input == "Delete") {
      end += 1;
    }
  }
  let result = `${val.substring(0, start)}${_input}${val.substring(
    end,
    val.length
  )}`;
  return result;
};

const isInt = (val) => {
  return /^-?\d+$/.test(val);
};

watch(
  () => props.total,
  (val) => {
    _page.value = p.value = 1;
  }
);

watch(
  () => props.page,
  (val) => {
    if (val != _page.value) {
      _page.value = p.value = val;
    }
  }
);
onMounted(() => {});
</script>
