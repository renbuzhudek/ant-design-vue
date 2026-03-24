<template>
  <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE">
    <template #description>
      <span>Customize <a href="#API">Description</a></span>
    </template>
  </a-empty>
</template>

<script setup lang="ts">
import { Empty } from '@ant-design-vue/ui'
</script>
