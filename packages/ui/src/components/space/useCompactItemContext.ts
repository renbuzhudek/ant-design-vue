import { computed, inject, type Ref } from 'vue'
import { spaceCompactItemContextKey } from './types'

/**
 * Used by child components (Button, Input, Select, etc.) to get compact-related
 * class names when placed inside a SpaceCompact.
 *
 * Follows the same pattern as the original ant-design-vue useCompactItemContext:
 * - Returns computed compactSize, compactDirection
 * - Returns compactItemClassnames that the component should merge into its root class
 *
 * @param prefixCls - Component's prefix class, e.g. ref('ant-btn')
 * @param direction - Global layout direction, e.g. ref('ltr')
 */
export function useCompactItemContext(
  prefixCls: Ref<string>,
  direction?: Ref<string | undefined>,
) {
  const context = inject(spaceCompactItemContextKey, undefined)

  const compactItemClassnames = computed(() => {
    if (!context) return ''

    const { compactDirection, isFirstItem, isLastItem } = context
    const separator = compactDirection === 'vertical' ? '-vertical-' : '-'

    return {
      [`${prefixCls.value}-compact${separator}item`]: true,
      [`${prefixCls.value}-compact${separator}first-item`]: isFirstItem,
      [`${prefixCls.value}-compact${separator}last-item`]: isLastItem,
      [`${prefixCls.value}-compact${separator}item-rtl`]: direction?.value === 'rtl',
    }
  })

  return {
    compactSize: computed(() => context?.compactSize),
    compactDirection: computed(() => context?.compactDirection),
    compactItemClassnames,
  }
}
