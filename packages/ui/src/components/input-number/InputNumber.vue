<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import UpOutlined from '@ant-design/icons-vue/UpOutlined'
import DownOutlined from '@ant-design/icons-vue/DownOutlined'
import type { InputNumberProps, InputNumberEmits, InputNumberSlots } from './types'
import { inputNumberDefaultProps } from './types'
import { useCompactItemContext } from '../space/useCompactItemContext'
import { useConfigInject } from '@/hooks'

defineOptions({ name: 'AInputNumber' })
const props = withDefaults(defineProps<InputNumberProps>(), inputNumberDefaultProps)
const emit = defineEmits<InputNumberEmits>()
defineSlots<InputNumberSlots>()
const slots = useSlots()
const { direction } = useConfigInject()
const { compactSize, compactItemClassnames } = useCompactItemContext(
  computed(() => 'ant-input-number'),
  direction,
)

const inputRef = ref<HTMLInputElement | null>(null)
const focused = ref(false)
const internalValue = ref<number | string | null>(
  props.value !== undefined ? props.value : props.defaultValue !== undefined ? props.defaultValue : null,
)

watch(
  () => props.value,
  (v) => {
    if (v !== undefined) {
      internalValue.value = v
    }
  },
)

const currentValue = computed(() =>
  props.value !== undefined ? props.value : internalValue.value,
)

function toNumber(val: string | number | null | undefined): number | null {
  if (val === null || val === undefined || val === '') return null
  const num = Number(val)
  return Number.isNaN(num) ? null : num
}

function clamp(val: number): number {
  let result = val
  if (props.min !== undefined && result < props.min) result = props.min
  if (props.max !== undefined && result > props.max) result = props.max
  return result
}

function applyPrecision(val: number): number {
  if (props.precision !== undefined) {
    return Number(val.toFixed(props.precision))
  }
  // Infer precision from step
  const stepStr = String(props.step)
  const dotIndex = stepStr.indexOf('.')
  if (dotIndex >= 0) {
    const stepPrecision = stepStr.length - dotIndex - 1
    return Number(val.toFixed(stepPrecision))
  }
  return val
}

function setValue(val: number | string | null) {
  internalValue.value = val
  emit('update:value', val)
  emit('change', val)
}

function parseInput(inputStr: string): number | string | null {
  if (props.parser) {
    return props.parser(inputStr)
  }
  if (inputStr === '' || inputStr === '-') return inputStr === '-' ? inputStr : null
  const num = Number(inputStr)
  return Number.isNaN(num) ? null : num
}

const displayValue = computed(() => {
  const val = currentValue.value
  if (val === null || val === undefined) return ''
  if (props.formatter) {
    return props.formatter(val)
  }
  if (typeof val === 'string') return val
  if (props.precision !== undefined) {
    return val.toFixed(props.precision)
  }
  return String(val)
})

function handleInput(e: Event) {
  const inputStr = (e.target as HTMLInputElement).value
  const parsed = parseInput(inputStr)

  if (props.stringMode) {
    setValue(inputStr)
    return
  }

  // Allow intermediate typing states (e.g., "-", "1.", etc.)
  if (inputStr === '' || inputStr === '-' || inputStr.endsWith('.')) {
    internalValue.value = inputStr
    return
  }

  if (parsed !== null && typeof parsed === 'number') {
    setValue(parsed)
  }
}

function handleBlur(e: FocusEvent) {
  focused.value = false

  // Finalize value on blur — clamp and apply precision
  const val = currentValue.value
  if (val === null || val === undefined || val === '' || val === '-') {
    setValue(null)
  } else {
    const num = toNumber(val)
    if (num !== null) {
      const clamped = clamp(num)
      const precise = applyPrecision(clamped)
      setValue(props.stringMode ? String(precise) : precise)
    } else {
      setValue(null)
    }
  }

  emit('blur', e)
}

function handleFocus(e: FocusEvent) {
  focused.value = true
  emit('focus', e)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    emit('pressEnter', e)
    return
  }

  if (!props.keyboard) return

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    stepUp()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    stepDown()
  }
}

function stepUp() {
  if (props.disabled || props.readonly) return
  const cur = toNumber(currentValue.value) ?? 0
  const next = applyPrecision(clamp(cur + props.step))
  if (props.max !== undefined && next > props.max) return
  const result = props.stringMode ? String(next) : next
  setValue(result)
  emit('step', next, { offset: props.step, type: 'up' })
}

function stepDown() {
  if (props.disabled || props.readonly) return
  const cur = toNumber(currentValue.value) ?? 0
  const next = applyPrecision(clamp(cur - props.step))
  if (props.min !== undefined && next < props.min) return
  const result = props.stringMode ? String(next) : next
  setValue(result)
  emit('step', next, { offset: props.step, type: 'down' })
}

const isUpDisabled = computed(() => {
  if (props.disabled || props.readonly) return true
  if (props.max === undefined) return false
  const cur = toNumber(currentValue.value) ?? 0
  return cur >= props.max
})

const isDownDisabled = computed(() => {
  if (props.disabled || props.readonly) return true
  if (props.min === undefined) return false
  const cur = toNumber(currentValue.value) ?? 0
  return cur <= props.min
})

const hasAddon = computed(() => !!slots.addonBefore || !!slots.addonAfter)
const hasPrefix = computed(() => !!slots.prefix)

const mergedSize = computed(() => compactSize.value || props.size)

const wrapperClasses = computed(() => [
  compactItemClassnames.value,
  {
    'ant-input-number': true,
    'ant-input-number-sm': mergedSize.value === 'small',
    'ant-input-number-lg': mergedSize.value === 'large',
    'ant-input-number-disabled': props.disabled,
    'ant-input-number-readonly': props.readonly,
    'ant-input-number-borderless': !props.bordered,
    'ant-input-number-focused': focused.value,
    [`ant-input-number-status-${props.status}`]: !!props.status,
  },
])

defineExpose({
  focus: (opts?: FocusOptions) => inputRef.value?.focus(opts),
  blur: () => inputRef.value?.blur(),
  input: inputRef,
})
</script>

<template>
  <!-- With addon wrapper -->
  <div
    v-if="hasAddon"
    class="ant-input-number-group-wrapper"
    :class="[compactItemClassnames, { [`ant-input-number-group-wrapper-${mergedSize}`]: mergedSize }]"
  >
    <div class="ant-input-number-wrapper ant-input-number-group">
      <span v-if="$slots.addonBefore" class="ant-input-number-group-addon">
        <slot name="addonBefore" />
      </span>
      <div :class="wrapperClasses">
        <span v-if="hasPrefix" class="ant-input-number-prefix">
          <slot name="prefix" />
        </span>
        <div class="ant-input-number-input-wrap">
          <input
            :id="id"
            ref="inputRef"
            class="ant-input-number-input"
            type="text"
            inputmode="decimal"
            role="spinbutton"
            :aria-valuemin="min"
            :aria-valuemax="max"
            :aria-valuenow="typeof currentValue === 'number' ? currentValue : undefined"
            :value="displayValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :autofocus="autofocus"
            :name="name"
            @input="handleInput"
            @keydown="handleKeydown"
            @focus="handleFocus"
            @blur="handleBlur"
          />
        </div>
        <div v-if="controls" class="ant-input-number-handler-wrap">
          <button
            type="button"
            class="ant-input-number-handler ant-input-number-handler-up"
            :class="{ 'ant-input-number-handler-disabled': isUpDisabled }"
            :disabled="isUpDisabled"
            aria-label="Increase value"
            tabindex="-1"
            @click="stepUp"
          >
            <slot name="upIcon">
              <UpOutlined class="ant-input-number-handler-up-inner" />
            </slot>
          </button>
          <button
            type="button"
            class="ant-input-number-handler ant-input-number-handler-down"
            :class="{ 'ant-input-number-handler-disabled': isDownDisabled }"
            :disabled="isDownDisabled"
            aria-label="Decrease value"
            tabindex="-1"
            @click="stepDown"
          >
            <slot name="downIcon">
              <DownOutlined class="ant-input-number-handler-down-inner" />
            </slot>
          </button>
        </div>
      </div>
      <span v-if="$slots.addonAfter" class="ant-input-number-group-addon">
        <slot name="addonAfter" />
      </span>
    </div>
  </div>

  <!-- Standard (no addon) -->
  <div v-else :class="wrapperClasses">
    <span v-if="hasPrefix" class="ant-input-number-prefix">
      <slot name="prefix" />
    </span>
    <div class="ant-input-number-input-wrap">
      <input
        :id="id"
        ref="inputRef"
        class="ant-input-number-input"
        type="text"
        inputmode="decimal"
        role="spinbutton"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="typeof currentValue === 'number' ? currentValue : undefined"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :autofocus="autofocus"
        :name="name"
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>
    <div v-if="controls" class="ant-input-number-handler-wrap">
      <button
        type="button"
        class="ant-input-number-handler ant-input-number-handler-up"
        :class="{ 'ant-input-number-handler-disabled': isUpDisabled }"
        :disabled="isUpDisabled"
        aria-label="Increase value"
        tabindex="-1"
        @click="stepUp"
      >
        <slot name="upIcon">
          <span class="ant-input-number-handler-up-inner">&#9650;</span>
        </slot>
      </button>
      <button
        type="button"
        class="ant-input-number-handler ant-input-number-handler-down"
        :class="{ 'ant-input-number-handler-disabled': isDownDisabled }"
        :disabled="isDownDisabled"
        aria-label="Decrease value"
        tabindex="-1"
        @click="stepDown"
      >
        <slot name="downIcon">
          <span class="ant-input-number-handler-down-inner">&#9660;</span>
        </slot>
      </button>
    </div>
  </div>
</template>
