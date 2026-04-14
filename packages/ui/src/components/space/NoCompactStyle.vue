<script setup lang="ts">
import { provide } from 'vue'
import { spaceCompactItemContextKey } from './types'

// Provide null to prevent children from inheriting compact context
provide(spaceCompactItemContextKey, undefined as any)
</script>

<template>
  <slot />
</template>
