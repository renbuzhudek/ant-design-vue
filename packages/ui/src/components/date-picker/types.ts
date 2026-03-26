import type { Dayjs } from 'dayjs'
import type { Slot, ScopedSlot } from '@/utils/types'
import type { PickerMode, PanelMode, TimeProps, PresetDate, DisabledTimes, DateLocale } from '@/_internal/date-panel'

export type DatePickerSize = 'sm' | 'md' | 'lg'
export type DatePickerPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type DatePickerStatus = 'error' | 'warning'

// Re-export for convenience
export type { PickerMode, PanelMode, TimeProps, PresetDate, DisabledTimes, DateLocale }

export interface DatePickerProps {
  /** Current value (Dayjs or string when valueFormat is set) */
  value?: Dayjs | string | null
  /** Default value */
  defaultValue?: Dayjs | string | null
  /** Default date shown when panel opens (for navigation, not selection) */
  defaultPickerValue?: Dayjs | string | null
  /** Picker mode: date, week, month, quarter, year */
  picker?: PickerMode
  /** Display format — string, array of parse formats, or custom function */
  format?: string | string[] | ((value: Dayjs) => string)
  /** Value format string — when set, value/onChange use strings instead of Dayjs */
  valueFormat?: string
  /** Whether to show time selection */
  showTime?: boolean | TimeProps
  /** Show "Today" button in footer */
  showToday?: boolean
  /** Show "Now" button when showTime is true */
  showNow?: boolean
  /** Disabled dates */
  disabledDate?: (date: Dayjs) => boolean
  /** Disabled time for specific date */
  disabledTime?: (date: Dayjs | null) => DisabledTimes
  /** Whether the picker is disabled */
  disabled?: boolean
  /** Whether the picker is read-only */
  inputReadOnly?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Allow clearing the value */
  allowClear?: boolean
  /** Auto focus on mount */
  autofocus?: boolean
  /** Size variant */
  size?: DatePickerSize
  /** Controlled open state */
  open?: boolean
  /** Default open state */
  defaultOpen?: boolean
  /** Popup placement */
  placement?: DatePickerPlacement
  /** Popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  /** Popup class name */
  popupClassName?: string
  /** Preset quick-select options */
  presets?: PresetDate[]
  /** Validation status */
  status?: DatePickerStatus
  /** Whether to show border */
  bordered?: boolean
  // Legacy compat
  /** @deprecated Use `picker="week"` instead */
  mode?: PanelMode
}

export const datePickerDefaultProps = {
  picker: 'date',
  allowClear: true,
  bordered: true,
  showToday: true,
  showNow: true,
} as const

export interface DatePickerEmits {
  (e: 'update:value', value: Dayjs | string | null): void
  (e: 'change', value: Dayjs | string | null, dateString: string): void
  (e: 'update:open', open: boolean): void
  (e: 'openChange', open: boolean): void
  (e: 'panelChange', value: Dayjs | string | null, mode: PanelMode): void
  (e: 'ok', value: Dayjs | string | null): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

export interface DatePickerSlots {
  suffixIcon?: Slot
  clearIcon?: Slot
  prevIcon?: Slot
  nextIcon?: Slot
  superPrevIcon?: Slot
  superNextIcon?: Slot
  dateRender?: ScopedSlot<{ current: Dayjs }>
  renderExtraFooter?: ScopedSlot<{ mode: PanelMode }>
}

// ============ RangePicker ============

export type RangeValue = [Dayjs | null, Dayjs | null]
export type RangeStringValue = [string | null, string | null]

export interface RangePickerProps {
  /** Current value as [start, end] */
  value?: RangeValue | RangeStringValue | null
  /** Default value */
  defaultValue?: RangeValue | RangeStringValue | null
  /** Default date shown when panel opens */
  defaultPickerValue?: RangeValue | RangeStringValue | null
  /** Picker mode */
  picker?: PickerMode
  /** Display format — string, array of parse formats, or custom function */
  format?: string | string[] | ((value: Dayjs) => string)
  /** Value format string */
  valueFormat?: string
  /** Show time selection */
  showTime?: boolean | TimeProps
  /** Disabled dates */
  disabledDate?: (date: Dayjs) => boolean
  /** Disabled time */
  disabledTime?: (date: Dayjs | null, type: 'start' | 'end') => DisabledTimes
  /** Whether the picker is disabled */
  disabled?: boolean | [boolean, boolean]
  /** Whether inputs are read-only */
  inputReadOnly?: boolean
  /** Placeholder texts */
  placeholder?: [string, string]
  /** Allow clearing */
  allowClear?: boolean
  /** Separator between dates */
  separator?: string
  /** Size variant */
  size?: DatePickerSize
  /** Controlled open state */
  open?: boolean
  /** Default open state */
  defaultOpen?: boolean
  /** Popup placement */
  placement?: DatePickerPlacement
  /** Popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  /** Popup class name */
  popupClassName?: string
  /** Preset quick-select options */
  presets?: PresetDate<RangeValue>[]
  /** Allow empty for each input */
  allowEmpty?: [boolean, boolean]
  /** Validation status */
  status?: DatePickerStatus
  /** Whether to show border */
  bordered?: boolean
}

export const rangePickerDefaultProps = {
  picker: 'date',
  allowClear: true,
  bordered: true,
  separator: '~',
} as const

export interface RangePickerEmits {
  (e: 'update:value', value: RangeValue | RangeStringValue | null): void
  (e: 'change', value: RangeValue | RangeStringValue | null, dateStrings: [string, string]): void
  (e: 'update:open', open: boolean): void
  (e: 'openChange', open: boolean): void
  (e: 'calendarChange', dates: RangeValue | RangeStringValue | null, dateStrings: [string, string], info: { range: 'start' | 'end' }): void
  (e: 'panelChange', values: RangeValue | RangeStringValue | null, modes: [PanelMode, PanelMode]): void
  (e: 'ok', value: RangeValue | RangeStringValue | null): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

export interface RangePickerSlots {
  suffixIcon?: Slot
  clearIcon?: Slot
  separator?: Slot
  dateRender?: ScopedSlot<{ current: Dayjs }>
  renderExtraFooter?: ScopedSlot<{ mode: PanelMode }>
}

// ============ Helpers ============

const PICKER_FORMAT_MAP: Record<PickerMode, string> = {
  date: 'YYYY-MM-DD',
  week: 'YYYY-wo',
  month: 'YYYY-MM',
  quarter: 'YYYY-[Q]Q',
  year: 'YYYY',
}

export function getDefaultFormat(picker: PickerMode, showTime?: boolean | TimeProps): string {
  if (showTime) {
    const timeFormat = typeof showTime === 'object' && showTime.format ? showTime.format : 'HH:mm:ss'
    return `${PICKER_FORMAT_MAP.date} ${timeFormat}`
  }
  return PICKER_FORMAT_MAP[picker] || PICKER_FORMAT_MAP.date
}

/**
 * Extract a string format suitable for dayjs.format() / dayjs(str, fmt) parsing.
 * - string → returned as-is
 * - string[] → first element used
 * - function → falls back to picker default
 */
export function resolveFormatString(
  format: string | string[] | ((value: Dayjs) => string) | undefined,
  picker: PickerMode,
  showTime?: boolean | TimeProps,
): string {
  if (typeof format === 'string') return format
  if (Array.isArray(format)) return format[0]
  return getDefaultFormat(picker, showTime)
}

/**
 * Format a Dayjs value for display, supporting string / string[] / function formats.
 */
export function formatDisplayValue(
  value: Dayjs,
  format: string | string[] | ((value: Dayjs) => string) | undefined,
  picker: PickerMode,
  showTime?: boolean | TimeProps,
): string {
  if (typeof format === 'function') return format(value)
  return value.format(resolveFormatString(format, picker, showTime))
}

const SIZE_MAP: Record<string, DatePickerSize> = {
  large: 'lg',
  middle: 'md',
  small: 'sm',
  lg: 'lg',
  md: 'md',
  sm: 'sm',
}

export function resolveSize(size?: string): DatePickerSize {
  if (!size) return 'md'
  return SIZE_MAP[size] || 'md'
}
