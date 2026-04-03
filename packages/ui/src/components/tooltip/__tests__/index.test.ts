import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, h } from 'vue'
import Tooltip from '../Tooltip.vue'

describe('Tooltip', () => {
  it('should render correctly', () => {
    const wrapper = mount(Tooltip, {
      props: { title: 'prompt text' },
      slots: { default: () => h('span', 'Trigger') },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders the trigger element', () => {
    const wrapper = mount(Tooltip, {
      props: { title: 'prompt text' },
      slots: { default: () => h('span', 'Trigger') },
    })
    expect(wrapper.text()).toContain('Trigger')
  })

  it('renders trigger wrapper with correct class', () => {
    const wrapper = mount(Tooltip, {
      props: { title: 'prompt text' },
      slots: { default: () => h('span', 'Trigger') },
    })
    expect(wrapper.find('.ant-trigger-wrapper').exists()).toBe(true)
  })

  it('does not show popup when title is empty', () => {
    const wrapper = mount(Tooltip, {
      props: { title: '' },
      slots: { default: () => h('span', 'Trigger') },
    })
    // Trigger should be disabled when no title
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('accepts title slot', () => {
    const wrapper = mount(Tooltip, {
      slots: {
        default: () => h('span', 'Trigger'),
        title: () => h('strong', 'Slot Title'),
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('supports controlled open prop', async () => {
    const wrapper = mount(Tooltip, {
      props: { title: 'prompt text', open: true },
      slots: { default: () => h('span', 'Trigger') },
    })
    // When open=true, tooltip should be visible
    expect(wrapper.find('.ant-tooltip').exists()).toBe(true)
  })

  it('positions popup with left/top styles instead of transform', async () => {
    const wrapper = mount(Tooltip, {
      attachTo: document.body,
      props: {
        title: 'prompt text',
        open: true,
        zIndex: 1234,
        overlayStyle: {
          maxWidth: '123px',
          opacity: 0.9,
          '--tooltip-test-color': '#f50',
        },
      },
      slots: { default: () => h('span', 'Trigger') },
    })

    await nextTick()
    await nextTick()

    const popup = (wrapper.vm as { getPopupDomNode: () => HTMLElement | null }).getPopupDomNode()
    const styleAttr = popup?.getAttribute('style') ?? ''

    expect(popup).not.toBeNull()
    expect(styleAttr).toContain('left:')
    expect(styleAttr).toContain('top:')
    expect(styleAttr).not.toContain('transform:')
    expect(styleAttr).toContain('max-width: 123px')
    expect(styleAttr).toContain('opacity: 0.9')
    expect(styleAttr).toContain('--tooltip-test-color: #f50')

    wrapper.unmount()
  })

  it('supports overlayClassName', () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: 'test',
        open: true,
        overlayClassName: 'custom-class',
      },
      slots: { default: () => h('span', 'Trigger') },
    })
    expect(wrapper.find('.custom-class').exists()).toBe(true)
  })

  it('emits openChange events', async () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: 'test',
        trigger: 'click',
      },
      slots: { default: () => h('span', 'Trigger') },
    })
    await wrapper.find('.ant-trigger-wrapper').trigger('click')
    expect(wrapper.emitted('update:open')).toBeTruthy()
    expect(wrapper.emitted('openChange')).toBeTruthy()
  })

  it('supports deprecated visible prop', async () => {
    const wrapper = mount(Tooltip, {
      props: {
        title: 'test',
        trigger: 'click',
      },
      slots: { default: () => h('span', 'Trigger') },
    })
    await wrapper.find('.ant-trigger-wrapper').trigger('click')
    // Should also emit deprecated events
    expect(wrapper.emitted('update:visible')).toBeTruthy()
    expect(wrapper.emitted('visibleChange')).toBeTruthy()
  })

  it('renders preset color classes', () => {
    const wrapper = mount(Tooltip, {
      props: { title: 'test', color: 'blue', open: true },
      slots: { default: () => h('span', 'Trigger') },
    })
    expect(wrapper.find('.ant-tooltip-blue').exists()).toBe(true)
  })

  it('renders custom color as inline style', () => {
    const wrapper = mount(Tooltip, {
      props: { title: 'test', color: '#f50', open: true },
      slots: { default: () => h('span', 'Trigger') },
    })
    const inner = wrapper.find('.ant-tooltip-inner')
    expect(inner.attributes('style')).toContain('background')
  })

  it('supports arrow=false', () => {
    const wrapper = mount(Tooltip, {
      props: { title: 'test', arrow: false, open: true },
      slots: { default: () => h('span', 'Trigger') },
    })
    expect(wrapper.find('.ant-trigger-arrow').exists()).toBe(false)
  })
})
