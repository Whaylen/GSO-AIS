<template>
  <component :is="'TFieldWrapper'" v-on="events">
    <template v-if="type == 'number' && !hideNumberButtons" #append>
      <div class="flex flex-col-reverse items-center gap-0.5">
        <TButton
          icon="remove"
          iconSize="xs"
          class="rounded-b-md border border-dark/25 bg-glossy"
          tabindex="-1"
          @mousedown="startDecrement"
          @mouseup="stopDecrement"
          @mouseleave="stopDecrement"
        />
        <TButton
          icon="add"
          iconSize="xs"
          class="rounded-t-md border border-dark/25 bg-glossy"
          tabindex="-1"
          @mousedown="startIncrement"
          @mouseup="stopIncrement"
          @mouseleave="stopIncrement"
        />
      </div>
    </template>
    <template v-for="(index, name) in slots" v-slot:[name]="data">
      <slot :name="name" v-bind="data"></slot>
    </template>
    <template #default="{ classNames, attr }">
      <input
        v-model="data"
        v-bind="Object.assign({}, attr, inputAttr)"
        v-on="inputEvents"
        :name="name"
        :class="[...classNames, ..._inputClass]"
        class="h-[22px]"
        :maxlength="maxlength"
        @keypress="onKeyPress"
        :autocorrect="autocorrect"
        :autocapitalize="autocapitalize"
        :autocomplete="autocomplete"
      />
    </template>
  </component>
</template>

<script setup>
import { computed, useSlots, ref } from "vue";
import inputValidations from "./tInput";

const slots = useSlots();

const props = defineProps({
  modelValue: [String, Number],
  name: String,
  maxlength: {
    type: Number,
    default: 255,
  },
  min: {
    type: Number,
    default: undefined,
  },
  max: {
    type: Number,
    default: undefined,
  },
  type: {
    type: String,
    default: "text",
  },
  inputClass: {
    type: [Object, String],
    default: "",
  },
  hideNumberButtons: {
    type: Boolean,
    default: false,
  },
  autocomplete: {
    type: String,
    default: "on",
    validator: (val) =>
      [
        "on",
        "off",
        "name",
        "honorific-prefix",
        "given-name",
        "additional-name",
        "family-name",
        "honorific-suffix",
        "nickname",
        "email",
        "username",
        "new-password",
        "current-password",
        "one-time-code",
        "organization-title",
        "organization",
        "street-address",
        "shipping",
        "billing",
        "address-line1",
        "address-line2",
        "address-line3",
        "address-level4",
        "address-level3",
        "address-level2",
        "address-level1",
        "country",
        "country-name",
        "postal-code",
        "cc-name",
        "cc-given-name",
        "cc-additional-name",
        "cc-family-name",
        "cc-number",
        "cc-exp",
        "cc-exp-month",
        "cc-exp-year",
        "cc-csc",
        "cc-type",
        "transaction-currency",
        "transaction-amount",
        "language",
        "bday",
        "bday-day",
        "bday-month",
        "bday-year",
        "sex",
        "tel",
        "tel-country-code",
        "tel-national",
        "tel-area-code",
        "tel-local",
        "tel-extension",
        "impp",
        "url",
        "photo",
        "webauthn",
      ].indexOf(val) > -1,
  },
  autocorrect: {
    type: String,
    default: "on",
    validator: (val) => ["on", "off"].indexOf(val) > -1,
  },
  autocapitalize: {
    type: String,
    default: "sentences",
    validator: (val) =>
      ["none", "sentences", "words", "characters"].indexOf(val) > -1,
  },
});

const emit = defineEmits(["update:modelValue", "paste", "blur", "focus"]);

const incrementing = ref(false);
const decrementing = ref(false);
const timer = ref(null);
const delayer = ref(null);

const dataType = computed(
  () => inputValidations[props.type] ?? inputValidations["text"]
);
const validationOptions = computed(() => ({
  min: props.min,
  max: props.max,
  maxLength: props.maxlength,
}));

const inputAttr = computed(() => {
  let acceptedTypes = ["text", "password", "email"];
  let tmp = {
    type: acceptedTypes.indexOf(props.type) > -1 ? props.type : "text",
  };

  return tmp;
});

const inputEvents = computed(() => {
  let evt = {};
  Object.assign(evt, {
    paste: onPaste,
    blur: (e) => emit("blur", e),
    focus: (e) => emit("focus", e),
  });
  return evt;
});

const data = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", dataType.value.parse(val)),
});

const events = computed(() => {
  let evts = {};
  if (props.type == "number") {
    Object.assign(evts, {
      mousewheel: (e) => onScroll(e),
    });
  }
  return evts;
});

const _inputClass = computed(() =>
  Array.isArray(props.inputClass) ? props.inputClass : [props.inputClass]
);

const onPaste = (evt) => {
  if (evt.type == "paste") {
    let clipboardData = evt.clipboardData || window.Clipboard;
    let pastedData = clipboardData.getData("Text");

    let newInput = replaceSelection(evt, pastedData);
    let parsed = dataType.value.parse(newInput);

    if (!dataType.value.isValid(parsed, validationOptions.value)) {
      evt.stopPropagation();
      evt.preventDefault();
    }
    emit("paste", evt);
  }
};

const onKeyPress = (evt) => {
  let newInput = replaceSelection(evt, evt.key);
  let parsed = dataType.value.parse(newInput);
  if (!dataType.value.isValid(parsed, validationOptions.value)) {
    evt.preventDefault();
  }
};

const replaceSelection = (evt, input) => {
  let start = evt.target.selectionStart;
  let end = evt.target.selectionEnd;
  let val = `${evt.target.value}`;
  let result = `${val.substring(0, start)}${input}${val.substring(
    end,
    val.length
  )}`;
  return result;
};

const onScroll = (evt) => {
  evt.preventDefault();
  if (props.type == "number") {
    if (evt.deltaY > 0) {
      decrement();
    } else {
      increment();
    }
  }
};

const startIncrement = () => {
  increment();
  delayer.value = setTimeout(() => {
    incrementing.value = true;
    deincrement();
    clearTimeout(delayer.value);
  }, 500);
};
const stopIncrement = () => {
  incrementing.value = false;
  clearTimeout(delayer.value);
  clearInterval(timer.value);
};
const startDecrement = () => {
  decrement();
  delayer.value = setTimeout(() => {
    decrementing.value = true;
    deincrement();
  }, 500);
};
const stopDecrement = () => {
  decrementing.value = false;
  clearTimeout(delayer.value);
  clearInterval(timer.value);
};

const deincrement = () => {
  if (isNaN(props.modelValue)) {
    emit("update:modelValue", 0);
  }
  timer.value = setInterval(() => {
    if (incrementing.value) {
      increment();
    } else if (decrementing.value) {
      decrement();
    }
  }, 50);
};

const increment = (val = 1) => {
  let newVal = (parseInt(props.modelValue) || 0) + val;
  if (dataType.value.isValid(newVal, validationOptions.value)) {
    emit("update:modelValue", newVal);
  }
};
const decrement = (val = 1) => {
  let newVal = (parseInt(props.modelValue) || 0) - val;
  if (dataType.value.isValid(newVal, validationOptions.value)) {
    emit("update:modelValue", newVal);
  }
};
</script>
