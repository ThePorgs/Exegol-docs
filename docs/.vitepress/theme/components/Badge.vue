<template>
  <span :class="`VPBadge ${type}`">
    <slot>{{ displayText }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  type: 'pro' | 'enterprise' | 'new'
  text?: string
}>()

const displayText = computed(() => {
  return props.text ?? {
    'pro': 'Pro',
    'enterprise': 'Enterprise',
    'new': 'New!'
  }[props.type]
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.VPBadge {
  display: inline-block;
  margin: 4px 4px 0 2px;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 0 8px;
  line-height: 20px;
  font-size: 14px;
  font-weight: 400;
  font-family: 'Inter', sans-serif;
  transform: translateY(-2px);
}

.VPBadge.small {
  padding: 0 6px;
  line-height: 18px;
  font-size: 12px;
  transform: translateY(-8px);
}

.VPDocFooter .VPBadge {
  display: none;
}

.vp-doc h1 > .VPBadge {
  margin-top: 0;
  vertical-align: middle;
}

.vp-doc h2 > .VPBadge {
  margin-top: 0;
  padding: 0 8px;
  vertical-align: middle;
}

.vp-doc h3 > .VPBadge {
  vertical-align: middle;
}

.vp-doc h4 > .VPBadge,
.vp-doc h5 > .VPBadge,
.vp-doc h6 > .VPBadge {
  vertical-align: middle;
  line-height: 18px;
}

.VPBadge.pro {
  border-color: var(--badge-violet);
  color: var(--badge-violet);
  background-color: var(--badge-violet-bg);
}

.VPBadge.enterprise {
  border-color: var(--badge-blue);
  color: var(--badge-blue);
  background-color: var(--badge-blue-bg);
  opacity: 1;
}

.VPBadge.new {
  border-color: var(--badge-yellow);
  color: var(--badge-yellow);
  background-color: var(--badge-yellow-bg);
  opacity: 1;
}

</style>