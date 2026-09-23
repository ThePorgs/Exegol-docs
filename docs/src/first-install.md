---
title: First install
---

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  const hash = typeof window !== 'undefined' ? window.location.hash : ''
  window.location.replace('/workstation/install' + hash)
})
</script>

# First install

This page has moved to [Install Exegol Workstation](/workstation/install).
