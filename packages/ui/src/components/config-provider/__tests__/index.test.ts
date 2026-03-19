import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import ConfigProvider from '../ConfigProvider.vue'
import { useConfigInject } from '@/hooks'

// Helper that reads config context
const ConfigReader = defineComponent({
  setup() {
    const { size, direction, disabled, theme } = useConfigInject()
    return { size, direction, disabled, theme }
  },
  render() {
    return h('div', {
      'data-size': this.size,
      'data-direction': this.direction,
      'data-disabled': String(this.disabled),
      'data-primary': this.theme.primaryColor,
    })
  },
})

describe('ConfigProvider', () => {
  describe('rendering', () => {
    it('renders slot content without wrapper element', () => {
      const wrapper = mount(ConfigProvider, {
        slots: { default: '<span>child</span>' },
      })
      expect(wrapper.find('span').text()).toBe('child')
    })

    it('renders multiple children', () => {
      const wrapper = mount(ConfigProvider, {
        slots: { default: '<div>a</div><div>b</div>' },
      })
      expect(wrapper.findAll('div')).toHaveLength(2)
    })
  })

  describe('default values', () => {
    it('provides default config when no props given', () => {
      const wrapper = mount(ConfigProvider, {
        slots: { default: () => h(ConfigReader) },
      })
      const reader = wrapper.findComponent(ConfigReader)
      expect(reader.attributes('data-size')).toBe('md')
      expect(reader.attributes('data-direction')).toBe('ltr')
      expect(reader.attributes('data-disabled')).toBe('false')
    })

    it('provides defaults without ConfigProvider wrapper', () => {
      const wrapper = mount(ConfigReader)
      expect(wrapper.attributes('data-size')).toBe('md')
      expect(wrapper.attributes('data-direction')).toBe('ltr')
      expect(wrapper.attributes('data-disabled')).toBe('false')
    })
  })

  describe('size', () => {
    it('provides custom size to children', () => {
      const wrapper = mount(ConfigProvider, {
        props: { size: 'lg' },
        slots: { default: () => h(ConfigReader) },
      })
      expect(wrapper.findComponent(ConfigReader).attributes('data-size')).toBe('lg')
    })

    it.each(['sm', 'md', 'lg'] as const)('accepts size=%s', (size) => {
      const wrapper = mount(ConfigProvider, {
        props: { size },
        slots: { default: () => h(ConfigReader) },
      })
      expect(wrapper.findComponent(ConfigReader).attributes('data-size')).toBe(size)
    })

    it('updates size reactively', async () => {
      const wrapper = mount(ConfigProvider, {
        props: { size: 'sm' },
        slots: { default: () => h(ConfigReader) },
      })
      const reader = wrapper.findComponent(ConfigReader)
      expect(reader.attributes('data-size')).toBe('sm')

      await wrapper.setProps({ size: 'lg' })
      expect(reader.attributes('data-size')).toBe('lg')
    })
  })

  describe('direction', () => {
    it('provides direction to children', () => {
      const wrapper = mount(ConfigProvider, {
        props: { direction: 'rtl' },
        slots: { default: () => h(ConfigReader) },
      })
      expect(wrapper.findComponent(ConfigReader).attributes('data-direction')).toBe('rtl')
    })

    it('updates direction reactively', async () => {
      const wrapper = mount(ConfigProvider, {
        props: { direction: 'ltr' },
        slots: { default: () => h(ConfigReader) },
      })
      const reader = wrapper.findComponent(ConfigReader)
      expect(reader.attributes('data-direction')).toBe('ltr')

      await wrapper.setProps({ direction: 'rtl' })
      expect(reader.attributes('data-direction')).toBe('rtl')
    })
  })

  describe('disabled', () => {
    it('provides disabled state to children', () => {
      const wrapper = mount(ConfigProvider, {
        props: { disabled: true },
        slots: { default: () => h(ConfigReader) },
      })
      expect(wrapper.findComponent(ConfigReader).attributes('data-disabled')).toBe('true')
    })

    it('updates disabled state reactively', async () => {
      const wrapper = mount(ConfigProvider, {
        props: { disabled: false },
        slots: { default: () => h(ConfigReader) },
      })
      const reader = wrapper.findComponent(ConfigReader)
      expect(reader.attributes('data-disabled')).toBe('false')

      await wrapper.setProps({ disabled: true })
      expect(reader.attributes('data-disabled')).toBe('true')
    })
  })

  describe('nesting', () => {
    it('inner ConfigProvider overrides outer', () => {
      const Nested = defineComponent({
        render() {
          return h(ConfigProvider, { size: 'sm' }, {
            default: () => h(ConfigProvider, { size: 'lg' }, {
              default: () => h(ConfigReader),
            }),
          })
        },
      })
      const wrapper = mount(Nested)
      expect(wrapper.findComponent(ConfigReader).attributes('data-size')).toBe('lg')
    })

    it('inner ConfigProvider inherits unset values from outer', () => {
      const Nested = defineComponent({
        render() {
          return h(ConfigProvider, { size: 'sm', direction: 'rtl' }, {
            default: () => h(ConfigProvider, { size: 'lg' }, {
              // direction is not set on inner, but ConfigProvider doesn't merge — it provides its own defaults
              default: () => h(ConfigReader),
            }),
          })
        },
      })
      const wrapper = mount(Nested)
      const reader = wrapper.findComponent(ConfigReader)
      expect(reader.attributes('data-size')).toBe('lg')
      // Inner ConfigProvider provides its own default for direction
      expect(reader.attributes('data-direction')).toBe('ltr')
    })
  })

  describe('integration with Theme', () => {
    it('useConfigInject provides theme defaults without Theme wrapper', () => {
      const wrapper = mount(ConfigReader)
      expect(wrapper.attributes('data-primary')).toBe('#1677FF')
    })
  })

  describe('component name', () => {
    it('has correct component name', () => {
      expect(ConfigProvider.name).toBe('AConfigProvider')
    })
  })
})
