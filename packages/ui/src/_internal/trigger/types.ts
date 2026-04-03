import type { CSSProperties } from 'vue'
import type { Placement, Strategy } from '@floating-ui/vue'
import type { Slot } from '@/utils/types'

export type TriggerType = 'hover' | 'click' | 'focus' | 'contextmenu'

export interface TriggerProps {
  /** Whether the popup is visible (controlled) */
  open?: boolean
  /** Default visibility (uncontrolled) */
  defaultOpen?: boolean
  /** How to trigger the popup */
  trigger?: TriggerType | TriggerType[]
  /** Popup placement relative to trigger */
  placement?: Placement
  /** Positioning strategy */
  strategy?: Strategy
  /** Delay in ms before showing (for hover trigger) */
  mouseEnterDelay?: number
  /** Delay in ms before hiding (for hover trigger) */
  mouseLeaveDelay?: number
  /** Whether to show the arrow */
  arrow?: boolean
  /** Offset from the trigger element in px */
  offset?: number
  /** Whether to auto-adjust placement when near viewport edge */
  autoAdjustOverflow?: boolean
  /** Whether to destroy popup content when hidden */
  destroyOnHide?: boolean
  /** Custom class for the popup wrapper */
  popupClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
  /** Custom style for the popup wrapper */
  popupStyle?: CSSProperties
  /** Whether the popup is disabled */
  disabled?: boolean
  /** Function returning the container element */
  getPopupContainer?: () => HTMLElement
  /** Z-index for the popup */
  zIndex?: number
  /** Transition name for the popup animation */
  transitionName?: string
  /** Whether to align arrow to center of trigger */
  arrowPointAtCenter?: boolean
}

export const triggerDefaultProps = {
  trigger: 'hover' as TriggerType,
  placement: 'top' as Placement,
  strategy: 'absolute' as Strategy,
  mouseEnterDelay: 100,
  mouseLeaveDelay: 100,
  arrow: true,
  offset: 12,
  autoAdjustOverflow: true,
  destroyOnHide: false,
  disabled: false,
  transitionName: 'ant-zoom-big-fast',
} as const

export interface TriggerEmits {
  (e: 'update:open', open: boolean): void
  (e: 'openChange', open: boolean): void
}

export interface TriggerSlots {
  /** The trigger element */
  default?: Slot
  /** The popup content */
  popup?: Slot
}
