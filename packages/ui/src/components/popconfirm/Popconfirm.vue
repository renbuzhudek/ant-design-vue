<template>
  <Trigger
    ref="triggerRef"
    :open="mergedOpen"
    :trigger="props.trigger"
    :placement="floatingPlacement"
    :mouse-enter-delay="props.mouseEnterDelay"
    :mouse-leave-delay="props.mouseLeaveDelay"
    :arrow="showArrow"
    :offset="showArrow ? 12 : 8"
    :auto-adjust-overflow="props.autoAdjustOverflow"
    :destroy-on-hide="props.destroyTooltipOnHide"
    :popup-class="popupClasses"
    :popup-style="props.overlayStyle"
    :disabled="props.disabled"
    :get-popup-container="resolvedGetContainer"
    :z-index="props.zIndex"
    transition-name="ant-zoom-big-fast"
    @update:open="onOpenChange"
  >
    <slot />
    <template #popup>
      <div class="ant-popconfirm-inner">
        <div class="ant-popconfirm-message">
          <span v-if="hasIcon" class="ant-popconfirm-message-icon">
            <VNodes :vnodes="iconContent" />
          </span>
          <div class="ant-popconfirm-message-text">
            <div class="ant-popconfirm-title">
              <VNodes :vnodes="titleContent" />
            </div>
            <div v-if="hasDescription" class="ant-popconfirm-description">
              <VNodes :vnodes="descriptionContent" />
            </div>
          </div>
        </div>
        <div class="ant-popconfirm-buttons">
          <template v-if="props.showCancel">
            <slot name="cancelButton" v-bind="cancelButtonSlotProps">
              <a-button
                size="sm"
                v-bind="props.cancelButtonProps"
                @click="onCancel"
              >
                <VNodes :vnodes="cancelTextContent" />
              </a-button>
            </slot>
          </template>
          <slot name="okButton" v-bind="okButtonSlotProps">
            <a-button
              :variant="okButtonVariant"
              size="sm"
              v-bind="props.okButtonProps"
              :loading="confirmLoading"
              @click="onConfirm"
            >
              <VNodes :vnodes="okTextContent" />
            </a-button>
          </slot>
        </div>
      </div>
    </template>
  </Trigger>
</template>

<script setup lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  isVNode,
  onBeforeUnmount,
  onBeforeUpdate,
  ref,
  shallowRef,
  useSlots,
  watch,
} from 'vue'
import { Trigger } from '@/_internal/trigger'
import { useConfigInject } from '@/hooks'
import { resolveFloatingPlacement } from '../tooltip/types'
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled'
import type {
  PopconfirmProps,
  PopconfirmEmits,
  PopconfirmSlots,
  PopconfirmOpenChangeEvent,
} from './types'
import type { ButtonVariant } from '../button/types'
import { popconfirmDefaultProps } from './types'

defineOptions({ name: 'APopconfirm' })

const VNodes = defineComponent({
  name: 'PopconfirmVNodes',
  props: {
    vnodes: {
      type: null,
      default: null,
    },
  },
  setup(rendererProps) {
    return () => rendererProps.vnodes as any
  },
})

const LEGACY_OK_TYPE_VARIANT_MAP: Record<NonNullable<PopconfirmProps['okType']>, ButtonVariant> = {
  primary: 'solid',
  default: 'outlined',
  dashed: 'dashed',
  text: 'text',
  link: 'link',
}

const props = withDefaults(defineProps<PopconfirmProps>(), popconfirmDefaultProps)
const emit = defineEmits<PopconfirmEmits>()
defineSlots<PopconfirmSlots>()
const slots = useSlots()

const { getPopupContainer, locale } = useConfigInject()

const triggerRef = shallowRef<InstanceType<typeof Trigger> | null>(null)
const internalOpen = ref(props.defaultOpen ?? false)
const confirmLoading = ref(false)
const instance = getCurrentInstance()!
const rawProps = shallowRef<Record<string, unknown>>((instance.vnode.props || {}) as Record<string, unknown>)

function syncRawProps() {
  rawProps.value = (instance.vnode.props || {}) as Record<string, unknown>
}

onBeforeUpdate(syncRawProps)

function hasExplicitProp(propName: string, kebabName?: string) {
  return propName in rawProps.value || (!!kebabName && kebabName in rawProps.value)
}

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return !!value && typeof (value as PromiseLike<unknown>).then === 'function'
}

function toFunctionArray<T extends (...args: any[]) => unknown>(value: unknown): T[] {
  if (typeof value === 'function') {
    return [value as T]
  }
  if (Array.isArray(value)) {
    return value.filter((handler): handler is T => typeof handler === 'function')
  }
  return []
}

function getCompatHandlers<T extends (...args: any[]) => unknown>(
  handlers: T | T[] | undefined,
  rawPropName: 'onConfirm' | 'onCancel',
): T[] {
  const mergedHandlers = toFunctionArray<T>(handlers)

  toFunctionArray<T>(rawProps.value[rawPropName]).forEach(handler => {
    if (!mergedHandlers.includes(handler)) {
      mergedHandlers.push(handler)
    }
  })

  return mergedHandlers
}

function normalizeRenderable(content: unknown) {
  if (content == null || content === false) {
    return null
  }
  if (Array.isArray(content) || isVNode(content)) {
    return content
  }
  if (typeof content === 'string' || typeof content === 'number') {
    return content
  }
  return h(content as any)
}

function getSlotContent(slotFn: (() => any) | undefined) {
  const content = slotFn?.()
  return content?.length ? content : null
}

function resolveContent(options: {
  propName: string
  propValue: unknown
  slot: (() => any) | undefined
  kebabName?: string
  fallbackSlot?: (() => any) | undefined
  fallbackContent?: unknown
}) {
  const {
    propName,
    propValue,
    slot,
    kebabName,
    fallbackSlot,
    fallbackContent,
  } = options

  if (hasExplicitProp(propName, kebabName)) {
    return normalizeRenderable(propValue)
  }

  return getSlotContent(slot) ?? getSlotContent(fallbackSlot) ?? normalizeRenderable(fallbackContent)
}

function hasRenderableContent(content: unknown) {
  if (Array.isArray(content)) {
    return content.length > 0
  }
  return content !== null && content !== undefined && content !== false && content !== ''
}

// --- Open state ---
// Popconfirm manages its own open state (for confirm/cancel close behavior)
// Check raw vnode props to detect user-controlled mode
const isUserControlled = computed(() => {
  return hasExplicitProp('open') || hasExplicitProp('visible')
})

const mergedOpen = computed(() => {
  if (hasExplicitProp('open')) return props.open ?? false
  if (hasExplicitProp('visible')) return props.visible ?? false
  return internalOpen.value
})

const resolvedOkText = computed(() => {
  return locale.value.Popconfirm?.okText ?? popconfirmDefaultProps.okText
})

const resolvedCancelText = computed(() => {
  return locale.value.Popconfirm?.cancelText ?? popconfirmDefaultProps.cancelText
})

const okButtonVariant = computed(() => {
  return LEGACY_OK_TYPE_VARIANT_MAP[props.okType ?? popconfirmDefaultProps.okType]
})

const iconContent = computed(() => {
  return resolveContent({
    propName: 'icon',
    propValue: props.icon,
    slot: slots.icon,
    fallbackContent: h(ExclamationCircleFilled),
  })
})

const titleContent = computed(() => {
  return resolveContent({
    propName: 'title',
    propValue: props.title,
    slot: slots.title,
  })
})

const descriptionContent = computed(() => {
  return resolveContent({
    propName: 'description',
    propValue: props.description,
    slot: slots.description,
  })
})

const cancelTextContent = computed(() => {
  return resolveContent({
    propName: 'cancelText',
    kebabName: 'cancel-text',
    propValue: props.cancelText,
    slot: slots.cancelText,
    fallbackSlot: slots.cancel,
    fallbackContent: resolvedCancelText.value,
  })
})

const okTextContent = computed(() => {
  return resolveContent({
    propName: 'okText',
    kebabName: 'ok-text',
    propValue: props.okText,
    slot: slots.okText,
    fallbackContent: resolvedOkText.value,
  })
})

const hasIcon = computed(() => {
  return hasRenderableContent(iconContent.value)
})

// --- Check for description ---
const hasDescription = computed(() => {
  return hasRenderableContent(descriptionContent.value)
})

// --- Arrow ---
const showArrow = computed(() => {
  if (typeof props.arrow === 'boolean') return props.arrow
  return true
})

// --- Placement ---
const floatingPlacement = computed(() => resolveFloatingPlacement(props.placement!))

// --- Container ---
const resolvedGetContainer = computed(() => {
  if (props.getPopupContainer) {
    return () => props.getPopupContainer!(triggerRef.value?.triggerRef ?? document.body)
  }
  return getPopupContainer.value
})

// --- Popup classes ---
const popupClasses = computed(() => {
  const classes: string[] = ['ant-popconfirm', 'ant-popover']
  if (props.overlayClassName) {
    classes.push(props.overlayClassName)
  }
  return classes
})

const cancelButtonSlotProps = computed(() => ({
  onClick: onCancel as (event: MouseEvent) => void,
  size: 'small' as const,
  ...(props.cancelButtonProps ?? {}),
  cancel: onCancel as (event: MouseEvent) => void,
}))

const okButtonSlotProps = computed(() => ({
  onClick: onConfirm,
  type: props.okType,
  size: 'small' as const,
  ...(props.okButtonProps ?? {}),
  confirm: onConfirm,
}))

// --- Handlers ---
function setOpen(val: boolean, event?: PopconfirmOpenChangeEvent) {
  if (!isUserControlled.value) {
    internalOpen.value = val
  }
  if (!val) {
    confirmLoading.value = false
  }
  emit('update:open', val)
  emit('openChange', val, event)
  emit('update:visible', val)
  emit('visibleChange', val, event)
}

function onOpenChange(val: boolean) {
  setOpen(val)
}

function invokeConfirmHandlers(e: MouseEvent) {
  const handlers = getCompatHandlers(props.onConfirm, 'onConfirm')
  const results = handlers.map(handler => handler(e))
  return results.find(isThenable) ?? results.find(result => result !== undefined)
}

function invokeCancelHandlers(e: MouseEvent) {
  const handlers = getCompatHandlers(props.onCancel, 'onCancel')
  handlers.forEach(handler => handler(e))
}

function onConfirm(e: MouseEvent) {
  if (confirmLoading.value) {
    return
  }

  const result = invokeConfirmHandlers(e)
  if (isThenable(result)) {
    confirmLoading.value = true
    result.then(
      () => {
        confirmLoading.value = false
        setOpen(false)
      },
      () => {
        confirmLoading.value = false
      },
    )
    return
  }

  setOpen(false, e)
}

function onCancel(e: MouseEvent) {
  invokeCancelHandlers(e)
  setOpen(false, e)
}

function onDocumentKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && mergedOpen.value) {
    setOpen(false, e)
  }
}

watch(
  mergedOpen,
  open => {
    if (typeof document === 'undefined') {
      return
    }

    if (open) {
      document.addEventListener('keydown', onDocumentKeydown)
      return
    }

    document.removeEventListener('keydown', onDocumentKeydown)
  },
  { flush: 'post', immediate: true },
)

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', onDocumentKeydown)
  }
})

// --- Expose ---
defineExpose({
  getPopupDomNode: () => triggerRef.value?.floatingRef,
})
</script>
