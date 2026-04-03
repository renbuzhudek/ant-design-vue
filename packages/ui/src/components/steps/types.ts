import type { Slot } from '@/utils/types'
import type { Component, InjectionKey, Ref } from 'vue'

export type StepStatus = 'wait' | 'process' | 'finish' | 'error'

export interface StepItem {
  title?: string
  subTitle?: string
  description?: string
  icon?: Component
  status?: StepStatus
  disabled?: boolean
}

export interface StepsProps {
  /** Current active step index (zero-based) */
  current?: number
  /** Starting index for step numbering display (default 0) */
  initial?: number
  /** Status of the current step */
  status?: StepStatus
  /** Size of the steps */
  size?: 'default' | 'small'
  /** Direction of the steps layout */
  direction?: 'horizontal' | 'vertical'
  /** Placement of labels relative to icons */
  labelPlacement?: 'horizontal' | 'vertical'
  /** Visual type of the steps */
  type?: 'default' | 'navigation' | 'inline'
  /** Progress percentage for the current step icon */
  percent?: number
  /** Show dot style progress bar */
  progressDot?: boolean
  /** Declarative step items — alternative to using <Step> children */
  items?: StepItem[]
  /** Auto-switch to vertical layout on small screens */
  responsive?: boolean
}

export const stepsDefaultProps = {
  current: 0,
  initial: 0,
  status: 'process',
  direction: 'horizontal',
  labelPlacement: 'horizontal',
  type: 'default',
  responsive: true,
} as const

export interface StepsEmits {
  (e: 'update:current', current: number): void
  (e: 'change', current: number): void
}

export interface StepsSlots {
  default?: Slot
}

export interface StepProps {
  /** Title of the step */
  title?: string
  /** Subtitle of the step */
  subTitle?: string
  /** Description of the step */
  description?: string
  /** Custom icon component */
  icon?: Component
  /** Override the automatically determined status */
  status?: StepStatus
  /** Whether the step is disabled (not clickable) */
  disabled?: boolean
}

export interface StepSlots {
  default?: Slot
  title?: Slot
  subTitle?: Slot
  description?: Slot
  icon?: Slot
}

/** Context provided by Steps to each Step child */
export interface StepsContextType {
  current: Ref<number>
  initial: Ref<number>
  status: Ref<StepStatus>
  size: Ref<'default' | 'small'>
  direction: Ref<'horizontal' | 'vertical'>
  labelPlacement: Ref<'horizontal' | 'vertical'>
  percent: Ref<number | undefined>
  progressDot: Ref<boolean | undefined>
  type: Ref<'default' | 'navigation' | 'inline'>
  onStepClick?: (index: number) => void
  registerStep: () => number
  unregisterStep: (index: number) => void
}

export const stepsContextKey: InjectionKey<StepsContextType> = Symbol('stepsContext')
