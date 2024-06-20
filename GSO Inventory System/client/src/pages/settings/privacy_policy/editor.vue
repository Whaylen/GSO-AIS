<template>
  <div class="grid gap-5">
    <div
      class="sticky z-50 flex items-center gap-1 border-b border-foreground/25 bg-background-accent py-1"
      :class="{
        'top-0': !systemStore.settings.navbar.fixed,
        'top-12': systemStore.settings.navbar.fixed,
      }"
    >
      <div class="flex-auto">
        <TButton
          label="Back"
          icon="chevron_left"
          class="rounded-lg py-1 pr-3"
          :disabled="loading"
          @click="router.back()"
        />
      </div>
      <TButton
        class="rounded-md px-3 py-1"
        @click="openModal('sorter', editor.policies)"
        :disabled="editor.policies.length <= 1"
      >
        <div class="pointer-events-none flex items-center justify-center">
          <TIcon name="swap_vert" type="filled" size="sm" />
          <div v-if="$sm" class="flex-auto font-semibold uppercase">
            Rearrange
          </div>
        </div>
      </TButton>
      <TButton
        icon="add"
        :label="$sm ? 'Add Policy' : null"
        class="rounded-md px-3 py-1"
        :disabled="loading"
        @click="addSection"
      />
      <TButton
        :icon="loading ? 'motion_photos_on' : 'save'"
        :iconClass="{ 'animate-spin': loading }"
        :label="$sm ? 'Save Policy' : null"
        class="rounded-md bg-foreground/10 px-2 py-1"
        :disabled="loading"
        @click="savePolicy"
      />
      <TButton
        v-if="!!template"
        icon="refresh"
        class="rounded-md px-3 py-1"
        :disabled="loading"
        @click="readTemplate(template)"
      />
    </div>

    <EditorItem
      id="message_prompt"
      label="Prompt Message"
      description="This message is shown when the user have not yet accepted the Privacy Policy or if the policy is updated."
      class="rounded-lg border border-foreground/25"
    >
      <TTextEditor
        v-model="editor.prompt.value"
        :error="editor.prompt.error"
        :errorMessage="editor.prompt.errorMessage"
      />
    </EditorItem>
    <EditorItem class="rounded-lg border border-foreground/25">
      <template #title>
        <div class="flex items-center gap-2 py-1">
          <div class="flex-auto">Policies</div>
        </div>
      </template>
      <div
        v-if="!!template"
        class="rounded-lg border border-warning bg-warning/25 px-3 py-1"
      >
        <span class="font-bold">Note!</span>
        Rearranging and/or modifying the "collapsible" property without updating
        any of the sections' titles and content, as well as the prompt message
        above, will not result in the creation of a new policy group. It will
        simply change the order in which each section is displayed.
      </div>
      <template v-if="Object.keys(editor.policies).length <= 0">
        <div class="text-center font-semibold italic text-gray-400">
          No Sections!
        </div>
      </template>
      <template v-for="policy in editor.policies" :key="policy.id">
        <div
          :id="policy.id"
          class="animate-shake border-b border-t-4 border-foreground/10 px-1 py-2 transition-colors hover:bg-background/25 md:px-3"
        >
          <TInput
            :label="policy.title.name"
            v-model="policy.title.value"
            :error="policy.title.error"
            :errorMessage="policy.title.errorMessage"
            innerClass=""
          >
            <template #after>
              <div class="flex items-center gap-2">
                <TButton
                  icon="delete"
                  class="rounded-lg bg-negative px-2 py-1 text-light"
                  @click="removeSection(policy.id)"
                />
                <TCheckBox
                  v-if="$sm"
                  label="Collapsible"
                  v-model="policy.collapsible"
                />
              </div>
            </template>
          </TInput>
          <div v-if="!$sm" class="flex items-center justify-end gap-2 pb-4">
            <TCheckBox label="Collapsible" v-model="policy.collapsible" />
          </div>
          <TTextEditor
            label="Content"
            v-model="policy.content.value"
            :error="policy.content.error"
            :errorMessage="policy.content.errorMessage"
          />
        </div>
      </template>
    </EditorItem>
    <div class="min-h-screen-45"></div>
    <TDialog
      v-model="modal.show"
      v-bind="
        Object.assign(
          {},
          comOptions[modal.type]?.dialog ?? comOptions.default?.dialog
        )
      "
    >
      <component
        :is="components[modal.type]"
        v-model="modal.data"
        v-bind="
          Object.assign(
            {},
            comOptions[modal.type]?.bindings ?? comOptions.default?.bindings
          )
        "
        v-on="
          Object.assign(
            {},
            comOptions[modal.type]?.events ?? comOptions.default?.events
          )
        "
        @close="modal.show = false"
      />
    </TDialog>
  </div>
</template>

<script setup>
import { defineAsyncComponent, inject, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { Helpers, InputField, notify } from "@/scripts";
import { useSystemStore } from "@/stores";

const $api = inject("$api");
const router = useRouter();
const route = useRoute();
const systemStore = useSystemStore();
const $screen = useBreakpoints(breakpointsTailwind);
const $sm = $screen.greaterOrEqual("sm");

const EditorItem = defineAsyncComponent(() => import("./editorItem.vue"));
const components = {
  sorter: defineAsyncComponent(() => import("./sorter.vue")),
};

const comOptions = reactive({
  default: {
    bindings: {},
    events: {},
    dialog: {},
  },
  sorter: {
    bindings: {},
    events: {
      "update:modelValue": (value) => {
        editor.value.policies = value.sort((a, b) => a.order - b.order);
        modal.value.show = false;
      },
    },
    dialog: {
      persistent: true,
    },
  },
});

const template = ref(null);
const loading = ref(false);
const editor = ref({
  prompt: new InputField().setName("Prompt Message").setRules("required"),
  policies: [],
});

const modal = ref({
  show: false,
  type: "",
  data: null,
});

const savePolicy = () => {
  if (validate()) {
    loading.value = true;
    $api
      .post("/policy/privacy", getData())
      .then((response) => {
        notify({
          title: "Success!",
          type: "positive",
          text: response.data.message ?? "Policies Updated!",
        });
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const loadPrivacy = (id) => {
  loading.value = true;

  $api
    .get(`/policy/privacy/${id}`)
    .then((response) => {
      template.value = response.data.data;
      readTemplate(template.value);
    })
    .finally(() => {
      loading.value = false;
    });
};

const addSection = (scroll = true) => {
  let id = Helpers.uniqid("tmp_");
  editor.value.policies.push({
    id: id,
    title: new InputField().setName("Title").setRules(""),
    content: new InputField().setName("Content").setRules("required"),
    collapsible: false,
    order: editor.value.policies.length + 1,
  });
  if (scroll) {
    setTimeout(() => {
      scrollToEl(id);
    }, 100);
  }
};

const removeSection = (id) => {
  editor.value.policies = editor.value.policies.filter((p) => p.id != id);
};

const validate = () => {
  let errorEl = null;
  if (!editor.value.prompt.validate()) errorEl = "message_prompt";
  editor.value.policies.forEach((policy) => {
    policy.title.validate(policy.collapsible ? "required" : null);
    policy.content.validate();
    if (!errorEl && (policy.title.error || policy.content.error)) {
      errorEl = policy.id;
    }
  });
  let result = editor.value.policies.some(
    (policy) => !(policy.title.error || policy.content.error)
  );
  scrollToEl(errorEl);
  return !errorEl;
};

const getData = () => {
  let p = editor.value.policies.map((plcy) => ({
    title: plcy.title.value,
    content: plcy.content.value,
    collapsible: plcy.collapsible,
    order: plcy.order,
  }));
  return {
    prompt: editor.value.prompt.value,
    policies: p,
  };
};

const openModal = (type, data = null) => {
  modal.value.type = type;
  modal.value.data = data;
  modal.value.show = true;
};

const scrollToEl = (id) => {
  let el = document.getElementById(id);
  if (!!el) {
    let y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  }
};

const readTemplate = (data) => {
  editor.value.prompt.value = data.prompt;
  editor.value.policies = [];

  data.policies.forEach((policy) => {
    editor.value.policies.push({
      id: policy.id,
      title: new InputField(policy.title).setName("Title").setRules(""),
      content: new InputField(policy.content)
        .setName("Content")
        .setRules("required"),
      collapsible: policy.collapsible,
      order: policy.order,
    });
  });
};

onMounted(() => {
  if (!!route.params.id) {
    loadPrivacy(route.params.id);
  } else {
    setTimeout(() => {
      addSection(false);
    }, 150);
  }
});
</script>
