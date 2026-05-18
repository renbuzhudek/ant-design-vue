import type { Component, CSSProperties } from 'vue'
import type { Slot } from '@/utils/types'

export interface EmptyImageComponent extends Component {
  PRESENTED_IMAGE_DEFAULT?: boolean
  PRESENTED_IMAGE_SIMPLE?: boolean
}

export interface EmptyComponentStatics {
  PRESENTED_IMAGE_DEFAULT: EmptyImageComponent
  PRESENTED_IMAGE_SIMPLE: EmptyImageComponent
}

export interface EmptyProps {
  /** Custom description text; pass false or null to hide */
  description?: string | false | null
  /** Custom image (as URL string or built-in Empty image component) */
  image?: string | EmptyImageComponent
  /** Image style override */
  imageStyle?: CSSProperties
}

export const emptyDefaultProps = {} as const

export interface EmptySlots {
  default?: Slot
  description?: Slot
  image?: Slot
}
