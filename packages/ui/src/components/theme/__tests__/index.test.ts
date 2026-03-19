import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import Theme from '../Theme.vue'
import { useThemeInject } from '../hooks'
import type { ThemeContext } from '../hooks'

// Helper component that reads theme context
const ThemeReader = defineComponent({
  setup() {
    const theme = useThemeInject()
    return { theme }
  },
  render() {
    return h('div', {
      'data-appearance': this.theme.appearance,
      'data-primary': this.theme.primaryColor,
      'data-bg': this.theme.backgroundColor,
    })
  },
})

afterEach(() => {
  document.documentElement.classList.remove('light-theme', 'dark-theme')
})

describe('Theme', () => {
  describe('rendering', () => {
    it('renders slot content without wrapper element', () => {
      const wrapper = mount(Theme, {
        slots: { default: '<div class="child">hello</div>' },
      })
      expect(wrapper.find('.child').text()).toBe('hello')
    })

    it('renders multiple slot children', () => {
      const wrapper = mount(Theme, {
        slots: { default: '<span>a</span><span>b</span>' },
      })
      expect(wrapper.findAll('span')).toHaveLength(2)
    })

    it('injects a <style> tag with CSS variables', () => {
      const wrapper = mount(Theme)
      const style = wrapper.find('style')
      expect(style.exists()).toBe(true)
      expect(style.text()).toContain('--color-accent')
      expect(style.text()).toContain(':root')
    })

    it('generates full color palette in style tag', () => {
      const wrapper = mount(Theme)
      const text = wrapper.find('style').text()
      // Should contain all 10 accent levels
      for (let i = 1; i <= 10; i++) {
        expect(text).toContain(`--color-accent-${i}`)
      }
      // Should contain semantic colors
      expect(text).toContain('--color-error')
      expect(text).toContain('--color-warning')
      expect(text).toContain('--color-success')
      expect(text).toContain('--color-info')
      // Should contain neutral colors
      expect(text).toContain('--color-neutral')
      expect(text).toContain('--color-neutral-border')
    })
  })

  describe('provide/inject', () => {
    it('provides theme context to children', () => {
      const wrapper = mount(Theme, {
        props: { primaryColor: '#ff0000' },
        slots: { default: () => h(ThemeReader) },
      })
      const reader = wrapper.findComponent(ThemeReader)
      expect(reader.attributes('data-primary')).toBe('#ff0000')
    })

    it('provides appearance to children', () => {
      const wrapper = mount(Theme, {
        props: { appearance: 'dark' },
        slots: { default: () => h(ThemeReader) },
      })
      const reader = wrapper.findComponent(ThemeReader)
      expect(reader.attributes('data-appearance')).toBe('dark')
    })

    it('provides backgroundColor to children', () => {
      const wrapper = mount(Theme, {
        props: { backgroundColor: '#000000' },
        slots: { default: () => h(ThemeReader) },
      })
      const reader = wrapper.findComponent(ThemeReader)
      expect(reader.attributes('data-bg')).toBe('#000000')
    })

    it('provides default values when no Theme wrapper', () => {
      const wrapper = mount(ThemeReader)
      expect(wrapper.attributes('data-appearance')).toBe('light')
      expect(wrapper.attributes('data-primary')).toBe('#1677FF')
      expect(wrapper.attributes('data-bg')).toBe('#141414')
    })

    it('updates context reactively when props change', async () => {
      const wrapper = mount(Theme, {
        props: { primaryColor: '#ff0000' },
        slots: { default: () => h(ThemeReader) },
      })
      const reader = wrapper.findComponent(ThemeReader)
      expect(reader.attributes('data-primary')).toBe('#ff0000')

      await wrapper.setProps({ primaryColor: '#00ff00' })
      expect(reader.attributes('data-primary')).toBe('#00ff00')
    })

    it('supports nested Theme overrides', () => {
      const Nested = defineComponent({
        render() {
          return h(Theme, { primaryColor: '#ff0000' }, {
            default: () => h(Theme, { primaryColor: '#00ff00' }, {
              default: () => h(ThemeReader),
            }),
          })
        },
      })
      const wrapper = mount(Nested)
      const reader = wrapper.findComponent(ThemeReader)
      // Inner Theme should win
      expect(reader.attributes('data-primary')).toBe('#00ff00')
    })
  })

  describe('appearance class', () => {
    it('applies light-theme class by default', () => {
      mount(Theme)
      expect(document.documentElement.classList.contains('light-theme')).toBe(true)
    })

    it('applies dark-theme class', () => {
      mount(Theme, { props: { appearance: 'dark' } })
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true)
    })

    it('switches appearance class reactively', async () => {
      const wrapper = mount(Theme, { props: { appearance: 'light' } })
      expect(document.documentElement.classList.contains('light-theme')).toBe(true)

      await wrapper.setProps({ appearance: 'dark' })
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true)
      expect(document.documentElement.classList.contains('light-theme')).toBe(false)
    })

    it('removes only its own class - does not remove other classes', async () => {
      document.documentElement.classList.add('custom-class')
      const wrapper = mount(Theme, { props: { appearance: 'dark' } })

      wrapper.unmount()
      expect(document.documentElement.classList.contains('custom-class')).toBe(true)
      document.documentElement.classList.remove('custom-class')
    })

    it('cleans up appearance class on unmount', () => {
      const wrapper = mount(Theme, { props: { appearance: 'dark' } })
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true)

      wrapper.unmount()
      expect(document.documentElement.classList.contains('dark-theme')).toBe(false)
    })
  })

  describe('CSS variable generation', () => {
    it('generates different palettes for different primary colors', () => {
      const blue = mount(Theme, { props: { primaryColor: '#1677ff' } })
      const red = mount(Theme, { props: { primaryColor: '#ff4d4f' } })

      const blueStyle = blue.find('style').text()
      const redStyle = red.find('style').text()
      expect(blueStyle).not.toBe(redStyle)
    })

    it('generates dark mode palette when appearance is dark', () => {
      const light = mount(Theme, { props: { appearance: 'light' } })
      const dark = mount(Theme, { props: { appearance: 'dark' } })

      const lightStyle = light.find('style').text()
      const darkStyle = dark.find('style').text()
      expect(lightStyle).not.toBe(darkStyle)
    })

    it('updates CSS variables when primaryColor changes', async () => {
      const wrapper = mount(Theme, { props: { primaryColor: '#1677ff' } })
      const before = wrapper.find('style').text()

      await wrapper.setProps({ primaryColor: '#ff4d4f' })
      const after = wrapper.find('style').text()
      expect(before).not.toBe(after)
    })
  })

  describe('component name', () => {
    it('has correct component name', () => {
      expect(Theme.name).toBe('ATheme')
    })
  })
})
