<template>
  <Teleport :to="container || 'body'" :disabled="!container">
    <slot />
  </Teleport>
</template>

<script setup lang="ts">
import { shallowRef, onMounted, watch, onBeforeUnmount } from 'vue'

defineOptions({ name: 'Portal' })

const props = withDefaults(
  defineProps<{
    /** Function, selector, HTMLElement, or false for inline render */
    getContainer?: string | HTMLElement | (() => HTMLElement) | false
    /** Whether the portal content should be rendered */
    visible?: boolean
  }>(),
  {
    visible: true,
  },
)

const container = shallowRef<HTMLElement | null>(null)
let createdContainer: HTMLElement | null = null

function cleanupCreatedContainer() {
  if (createdContainer?.parentNode) {
    createdContainer.parentNode.removeChild(createdContainer)
  }
  createdContainer = null
}

function ensureCreatedContainer() {
  if (!createdContainer) {
    createdContainer = document.createElement('div')
    document.body.appendChild(createdContainer)
  }

  return createdContainer
}

function resolveContainerTarget() {
  if (typeof props.getContainer === 'string') {
    try {
      const matchedContainer = document.querySelector(props.getContainer)
      return matchedContainer instanceof HTMLElement ? matchedContainer : null
    } catch {
      return null
    }
  }

  if (typeof props.getContainer === 'function') {
    const resolvedContainer = props.getContainer()
    return resolvedContainer instanceof HTMLElement ? resolvedContainer : null
  }

  if (props.getContainer instanceof HTMLElement) {
    return props.getContainer
  }

  return null
}

function resolveContainer() {
  if (typeof document === 'undefined') return

  if (props.getContainer === false) {
    cleanupCreatedContainer()
    container.value = null
    return
  }

  const resolvedContainer = resolveContainerTarget()

  if (resolvedContainer) {
    cleanupCreatedContainer()
    container.value = resolvedContainer
    return
  }

  container.value = ensureCreatedContainer()
}

onMounted(() => {
  if (props.visible) {
    resolveContainer()
  }
})

watch(
  () => props.visible,
  (val) => {
    if (val && !container.value) {
      resolveContainer()
    }
  },
)

watch(
  () => props.getContainer,
  () => {
    resolveContainer()
  },
)

onBeforeUnmount(() => {
  cleanupCreatedContainer()
})
</script>
