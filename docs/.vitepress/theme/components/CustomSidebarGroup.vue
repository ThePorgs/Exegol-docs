<script setup lang="ts">
import type { DefaultTheme } from 'vitepress/theme'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import VPSidebarItem from './CustomSidebarItem.vue'

defineProps<{
  items: (DefaultTheme.SidebarItem & { badge?: 'pro' | 'enterprise' | 'new' })[]
}>()

const disableTransition = ref(true)

let timer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  timer = setTimeout(() => {
    timer = null
    disableTransition.value = false
  }, 300)
})

onBeforeUnmount(() => {
  if (timer != null) {
    clearTimeout(timer)
    timer = null
  }
})
</script>

<template>
  <div
    v-for="item in items"
    :key="item.text"
    class="group"
    :class="{ 'no-transition': disableTransition }"
  >
    <VPSidebarItem :item="item" :depth="0" />
  </div>
</template>

<style scoped>
.no-transition :deep(.caret-icon) {
  transition: none;
}

.group + .group {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 10px;
}

.group-title {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1.1em;
  margin-bottom: 4px;
  gap: 8px;
}

.badge {
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
}
.badge-pro { color: var(--badge-violet); }
.badge-enterprise { color: var(--badge-blue); }
.badge-new { color: var(--badge-yellow); }
.badge-wip { color: var(--badge-orange, orange); }

@media (min-width: 960px) {
  .group {
    padding-top: 10px;
    width: calc(var(--vp-sidebar-width) - 64px);
  }
}
</style> 