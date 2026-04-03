import type { CSSProperties } from 'vue'
import type { Slot } from '@/utils/types'
import type { TriggerType } from '@/_internal/trigger/types'
import type { TooltipPlacement } from '../tooltip/types'
import type { MenuProps, ItemType } from '../menu/types'

/** Dropdown placement — a subset of tooltip placements */
export type DropdownPlacement =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'top'
  | 'bottom'

export interface DropdownProps {
  /** Trigger mode */
  trigger?: TriggerType | TriggerType[]
  /** Dropdown placement */
  placement?: DropdownPlacement
  /** Whether the dropdown is disabled */
  disabled?: boolean
  /** Whether the dropdown is visible (controlled) */
  open?: boolean
  /** @deprecated Use `open` instead */
  visible?: boolean
  /** Default visibility (uncontrolled) */
  defaultOpen?: boolean
  /** Whether to show arrow */
  arrow?: boolean | { pointAtCenter?: boolean }
  /** Class for the overlay */
  overlayClassName?: string
  /** Style for the overlay */
  overlayStyle?: CSSProperties
  /** Delay before showing (ms, hover trigger) */
  mouseEnterDelay?: number
  /** Delay before hiding (ms, hover trigger) */
  mouseLeaveDelay?: number
  /** Destroy popup when hidden */
  destroyPopupOnHide?: boolean
  /** Custom popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  /** Z-index */
  zIndex?: number
  /** Data-driven menu items */
  menu?: MenuProps & { items?: ItemType[] }
  /** Auto focus the dropdown when open */
  autoFocus?: boolean
}

export const dropdownDefaultProps = {
  trigger: 'hover' as TriggerType,
  placement: 'bottomLeft' as DropdownPlacement,
  disabled: false,
  mouseEnterDelay: 150,
  mouseLeaveDelay: 100,
  destroyPopupOnHide: false,
  autoFocus: false,
} as const

export interface DropdownEmits {
  (e: 'update:open', open: boolean): void
  (e: 'openChange', open: boolean): void
  /** @deprecated Use update:open */
  (e: 'update:visible', open: boolean): void
  /** @deprecated Use openChange */
  (e: 'visibleChange', open: boolean): void
}

export interface DropdownSlots {
  /** The trigger element */
  default?: Slot
  /** The dropdown content (typically a Menu) */
  overlay?: Slot
}

// ---------------------------------------------------------------------------
// DropdownButton
// ---------------------------------------------------------------------------

export type DropdownButtonType = 'default' | 'primary' | 'dashed' | 'text' | 'link'

export interface DropdownButtonProps {
  /** Button variant */
  type?: DropdownButtonType
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Whether the button is loading */
  loading?: boolean
  /** Whether the button is disabled */
  disabled?: boolean
  /** Danger style */
  danger?: boolean
  /** Href for the left button (renders as <a>) */
  href?: string
  /** Dropdown trigger mode */
  trigger?: TriggerType | TriggerType[]
  /** Dropdown placement */
  placement?: DropdownPlacement
  /** Whether the dropdown is visible (controlled) */
  open?: boolean
  /** Whether to show arrow */
  arrow?: boolean | { pointAtCenter?: boolean }
  /** Class for the overlay */
  overlayClassName?: string
  /** Style for the overlay */
  overlayStyle?: CSSProperties
  /** Destroy popup when hidden */
  destroyPopupOnHide?: boolean
  /** Custom popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  /** Data-driven menu items */
  menu?: MenuProps & { items?: ItemType[] }
}

export const dropdownButtonDefaultProps = {
  type: 'default' as DropdownButtonType,
  trigger: 'hover' as TriggerType,
  placement: 'bottomRight' as DropdownPlacement,
  disabled: false,
  loading: false,
  danger: false,
} as const

export interface DropdownButtonEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'update:open', open: boolean): void
  (e: 'openChange', open: boolean): void
}

export interface DropdownButtonSlots {
  /** Left button content */
  default?: Slot
  /** Dropdown content (typically a Menu) */
  overlay?: Slot
  /** Custom icon for the right button */
  icon?: Slot
}
