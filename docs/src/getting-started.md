---
title: Getting started
---

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  const hash = typeof window !== 'undefined' ? window.location.hash : ''
  window.location.replace('/start-now' + hash)
})
</script>

# Getting started

This page has moved to [Start now](/start-now).
