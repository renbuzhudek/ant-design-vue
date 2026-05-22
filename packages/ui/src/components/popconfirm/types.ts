import type { CSSProperties } from 'vue'
import type { MaybeArray, Slot, ScopedSlot } from '@/utils/types'
import type { TooltipPlacement } from '../tooltip/types'
import type { TriggerType } from '@/_internal/trigger/types'
import type { ButtonProps } from '../button/types'

export type PopconfirmOpenChangeEvent = MouseEvent | KeyboardEvent | undefined
export type PopconfirmConfirmHandler = (event: MouseEvent) => unknown | Promise<unknown>
export type PopconfirmCancelHandler = (event: MouseEvent) => void

export interface PopconfirmCancelButtonSlotProps extends Partial<ButtonProps> {
  onClick?: (event: MouseEvent) => void
  size?: ButtonProps['size']
  cancel: (event: MouseEvent) => void
}

export interface PopconfirmOkButtonSlotProps extends Partial<ButtonProps> {
  onClick?: (event: MouseEvent) => void
  size?: ButtonProps['size']
  type?: ButtonProps['type']
  confirm: (event: MouseEvent) => void
}

export interface PopconfirmProps {
  /** The confirmation message */
  title?: string | number
  /** Additional description text */
  description?: string | number
  /** Whether the popconfirm is visible (controlled). null = uncontrolled. */
  open?: boolean | null
  /** Default visibility (uncontrolled) */
  defaultOpen?: boolean
  /** @deprecated Use `open` instead */
  visible?: boolean
  /** Whether the popconfirm is disabled */
  disabled?: boolean
  /** OK button text */
  okText?: string
  /** Cancel button text */
  cancelText?: string
  /** OK button variant (maps to button type) */
  okType?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
  /** Props for the OK button */
  okButtonProps?: Partial<ButtonProps>
  /** Props for the Cancel button */
  cancelButtonProps?: Partial<ButtonProps>
  /** Whether to show the cancel button */
  showCancel?: boolean
  /** Custom icon */
  icon?: any
  /** Popconfirm placement */
  placement?: TooltipPlacement
  /** How to trigger */
  trigger?: TriggerType | TriggerType[]
  /** Whether to show arrow */
  arrow?: boolean | { pointAtCenter?: boolean }
  /** Delay in ms before showing */
  mouseEnterDelay?: number
  /** Delay in ms before hiding */
  mouseLeaveDelay?: number
  /** Class for the overlay */
  overlayClassName?: string
  /** Style for the overlay */
  overlayStyle?: CSSProperties
  /** Destroy popup on hide */
  destroyTooltipOnHide?: boolean
  /** Auto adjust when near edges */
  autoAdjustOverflow?: boolean
  /** Custom popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  /** Z-index */
  zIndex?: number
  /** Confirm callback; can return a Promise to delay closing */
  onConfirm?: MaybeArray<PopconfirmConfirmHandler>
  /** Cancel callback */
  onCancel?: MaybeArray<PopconfirmCancelHandler>
}

export const popconfirmDefaultProps = {
  trigger: 'click' as TriggerType,
  placement: 'top' as TooltipPlacement,
  arrow: true,
  mouseEnterDelay: 100,
  mouseLeaveDelay: 100,
  destroyTooltipOnHide: false,
  autoAdjustOverflow: true,
  disabled: false,
  okType: 'primary' as const,
  showCancel: true,
  okText: 'OK',
  cancelText: 'Cancel',
} as const

export interface PopconfirmEmits {
  (e: 'update:open', open: boolean): void
  (e: 'openChange', open: boolean, event?: PopconfirmOpenChangeEvent): void
  (e: 'confirm', event: MouseEvent): void
  (e: 'cancel', event: MouseEvent): void
  /** @deprecated */
  (e: 'update:visible', open: boolean): void
  /** @deprecated */
  (e: 'visibleChange', open: boolean, event?: PopconfirmOpenChangeEvent): void
}

export interface PopconfirmSlots {
  /** The trigger element */
  default?: Slot
  /** Confirmation message */
  title?: Slot
  /** Description text */
  description?: Slot
  /** Custom icon */
  icon?: Slot
  /** Custom OK button text */
  okText?: Slot
  /** Legacy custom Cancel button text */
  cancel?: Slot
  /** Custom Cancel button text */
  cancelText?: Slot
  /** Custom cancel button */
  cancelButton?: ScopedSlot<PopconfirmCancelButtonSlotProps>
  /** Custom OK button */
  okButton?: ScopedSlot<PopconfirmOkButtonSlotProps>
}
