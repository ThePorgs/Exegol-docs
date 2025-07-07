<script setup lang="ts">
import { inject, computed } from 'vue'
import { useRoute } from 'vitepress'
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import type { DefaultTheme } from 'vitepress'

const props = defineProps<{
  item: DefaultTheme.NavItemWithLink
}>()

const route = useRoute()
const iconMap = inject<Record<string, any>>('nav-icon-map', {})

const Icon = iconMap?.[props.item.text] || null

const isActive = computed(() =>
  route.path === props.item.link || route.path.startsWith(props.item.link + '/')
)
</script>

<template>
  <div class="vp-menu-link" :class="{ active: isActive }">
    <VPLink :href="item.link" class="vp-link">
      <span class="link-content">
        <component v-if="Icon" :is="Icon" class="menu-icon" />
        <span>{{ item.text }}</span>
      </span>
    </VPLink>
  </div>
</template>

<style scoped>
.vp-menu-link .vp-link {
  display: block;
  padding: 0 12px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-emphasis);
  white-space: nowrap;
  border-radius: 6px;
  transition: background-color 0.25s, color 0.25s;
}

.vp-menu-link .vp-link:hover {
  color: var(--vp-c-text-emphasis);
  background-color: var(--vp-c-default-soft);
}

.vp-menu-link.active .vp-link {
  color: var(--vp-c-brand-1);
}

.link-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-icon {
  width: 16px;
  height: 16px;
}
</style>
