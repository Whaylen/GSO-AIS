<template>
  <div class="TScroll flex-auto overflow-auto px-3 py-2">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.TScroll::-webkit-scrollbar-track {
  margin-block: 0.25rem;
}
</style>
