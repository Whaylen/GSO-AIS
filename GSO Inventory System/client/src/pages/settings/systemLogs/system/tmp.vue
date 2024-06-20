<template>
  <UseVirtualList
    :list="logged"
    :options="{ itemHeight: 42 }"
    style="height: 100%"
    class="w-full overflow-x-auto"
    v-slot="{ data, index }"
  >
    <div
      class="group flex gap-5 border-b border-foreground/10 font-mono text-sm"
    >
      <div
        class="select-none text-end font-bold text-foreground/40 group-hover:text-foreground/75"
        :style="{
          minWidth: `${7.7 * (logged.length + '').length + 4}px`,
        }"
      >
        {{ index + 1 }}
      </div>
      <div class="">
        {{ data }}
      </div>
    </div>
  </UseVirtualList>
</template>
