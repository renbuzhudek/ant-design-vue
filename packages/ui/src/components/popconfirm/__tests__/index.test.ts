import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import QuestionCircleOutlined from '@ant-design/icons-vue/QuestionCircleOutlined'
import Popconfirm from '../Popconfirm.vue'
import ConfigProvider from '../../config-provider/ConfigProvider.vue'
import type {
  PopconfirmCancelButtonSlotProps,
  PopconfirmOkButtonSlotProps,
} from '../types'

const mountedWrappers: Array<{ unmount: () => void }> = []

function trackMount<T extends { unmount: () => void }>(wrapper: T) {
  mountedWrappers.push(wrapper)
  return wrapper
}

async function flushPopup() {
  await nextTick()
  await nextTick()
}

function getPopup() {
  return document.body.querySelector('.ant-popconfirm') as HTMLElement | null
}

function getButtons() {
  return Array.from(document.body.querySelectorAll('.ant-popconfirm-buttons .ant-btn')) as HTMLElement[]
}

afterEach(() => {
  mountedWrappers.splice(0).reverse().forEach(wrapper => wrapper.unmount())
  vi.restoreAllMocks()
  vi.useRealTimers()
  document.body.innerHTML = ''
})

describe('Popconfirm', () => {
  it('should render correctly', () => {
    const wrapper = trackMount(mount(Popconfirm, {
      props: { title: 'Are you sure?' },
      slots: { default: () => h('span', 'Delete') },
    }))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders the trigger element', () => {
    const wrapper = trackMount(mount(Popconfirm, {
      props: { title: 'Are you sure?' },
      slots: { default: () => h('span', 'Delete') },
    }))
    expect(wrapper.text()).toContain('Delete')
  })

  it('shows confirmation content when open', async () => {
    trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', open: true },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()
    expect(getPopup()?.querySelector('.ant-popconfirm-title')?.textContent).toBe('Are you sure?')
    expect(getPopup()?.querySelector('.ant-popconfirm-buttons')).not.toBeNull()
  })

  it('shows description when provided', async () => {
    trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', description: 'This cannot be undone.', open: true },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()
    expect(getPopup()?.querySelector('.ant-popconfirm-description')?.textContent).toBe('This cannot be undone.')
  })

  it('does not show description when not provided', async () => {
    trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', open: true },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()
    expect(getPopup()?.querySelector('.ant-popconfirm-description')).toBeNull()
  })

  it('shows default OK and Cancel buttons', async () => {
    trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', open: true },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()
    expect(getPopup()?.textContent).toContain('OK')
    expect(getPopup()?.textContent).toContain('Cancel')
  })

  it('does not warn for the default okType legacy mapping', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', open: true },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()

    expect(warn).not.toHaveBeenCalledWith(
      expect.stringContaining('Button: `type="primary"` is deprecated'),
    )
  })

  it('supports custom okText and cancelText', async () => {
    trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: {
        title: 'Are you sure?',
        open: true,
        okText: 'Yes',
        cancelText: 'No',
      },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()
    expect(getPopup()?.textContent).toContain('Yes')
    expect(getPopup()?.textContent).toContain('No')
  })

  it('uses Popconfirm locale defaults when button text props are not provided', async () => {
    trackMount(mount(ConfigProvider, {
      attachTo: document.body,
      props: {
        locale: {
          locale: 'zh-CN',
          Popconfirm: {
            okText: '确定',
            cancelText: '取消',
          },
        },
      },
      slots: {
        default: () => h(Popconfirm, { title: 'Are you sure?', open: true }, {
          default: () => h('span', 'Delete'),
        }),
      },
    }))

    await flushPopup()
    expect(getPopup()?.textContent).toContain('确定')
    expect(getPopup()?.textContent).toContain('取消')
  })

  it('supports legacy cancel text slot alias', async () => {
    trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', open: true },
      slots: {
        default: () => h('span', 'Delete'),
        cancel: () => 'Abort',
      },
    }))

    await flushPopup()
    expect(getPopup()?.textContent).toContain('Abort')
  })

  it('renders title slot content from template setup scope', async () => {
    trackMount(mount(defineComponent({
      components: { Popconfirm },
      setup() {
        const text = 'Are you sure to delete this task?'
        return { text }
      },
      template: `
        <Popconfirm :open="true">
          <template #title>
            <p>{{ text }}</p>
            <p>{{ text }}</p>
          </template>
          <span>Delete</span>
        </Popconfirm>
      `,
    }), {
      attachTo: document.body,
    }))

    await flushPopup()
    expect(getPopup()?.querySelector('.ant-popconfirm-title')?.textContent)
      .toContain('Are you sure to delete this task?Are you sure to delete this task?')
  })

  it('hides cancel button when showCancel is false', async () => {
    trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', open: true, showCancel: false },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()
    expect(getButtons()).toHaveLength(1)
  })

  it('hides custom cancelButton slot when showCancel is false', async () => {
    trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', open: true, showCancel: false },
      slots: {
        default: () => h('span', 'Delete'),
        cancelButton: () => h('button', { class: 'custom-cancel' }, 'Cancel'),
      },
    }))

    await flushPopup()
    expect(getPopup()?.querySelector('.custom-cancel')).toBeNull()
    expect(getButtons()).toHaveLength(1)
  })

  it('renders the default warning icon', async () => {
    trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', open: true },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()
    expect(getPopup()?.querySelector('.ant-popconfirm-message-icon svg')).not.toBeNull()
  })

  it('renders the legacy arrow content structure', async () => {
    trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', open: true },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()
    expect(getPopup()?.querySelector('.ant-trigger-arrow-content')).not.toBeNull()
  })

  it('keeps explicit title, description and text props ahead of slots', async () => {
    trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: {
        title: 'Prop title',
        description: 'Prop description',
        okText: 'Prop OK',
        cancelText: 'Prop Cancel',
        open: true,
      },
      slots: {
        default: () => h('span', 'Delete'),
        title: () => 'Slot title',
        description: () => 'Slot description',
        okText: () => 'Slot OK',
        cancel: () => 'Slot Cancel',
        cancelText: () => 'Slot Cancel Text',
      },
    }))

    await flushPopup()

    const popupText = getPopup()?.textContent ?? ''
    expect(getPopup()?.querySelector('.ant-popconfirm-title')?.textContent).toContain('Prop title')
    expect(getPopup()?.querySelector('.ant-popconfirm-title')?.textContent).not.toContain('Slot title')
    expect(getPopup()?.querySelector('.ant-popconfirm-description')?.textContent).toContain('Prop description')
    expect(getPopup()?.querySelector('.ant-popconfirm-description')?.textContent).not.toContain('Slot description')
    expect(popupText).toContain('Prop OK')
    expect(popupText).toContain('Prop Cancel')
    expect(popupText).not.toContain('Slot OK')
    expect(popupText).not.toContain('Slot Cancel')
    expect(popupText).not.toContain('Slot Cancel Text')
  })

  it('calls confirm handler and closes popup', async () => {
    const confirm = vi.fn()
    const wrapper = trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', trigger: 'click', onConfirm: confirm },
      slots: { default: () => h('span', 'Delete') },
    }))
    await wrapper.find('.ant-trigger-wrapper').trigger('click')
    await flushPopup()

    getButtons()[1]?.click()
    await flushPopup()

    expect(confirm).toHaveBeenCalledTimes(1)
    expect((wrapper.vm as { getPopupDomNode: () => HTMLElement | null }).getPopupDomNode()?.style.display).toBe('none')
  })

  it('calls cancel handler and closes popup', async () => {
    const cancel = vi.fn()
    const wrapper = trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', open: true, onCancel: cancel },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()
    getButtons()[0]?.click()
    await flushPopup()

    expect(cancel).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('openChange')?.at(-1)?.[0]).toBe(false)
    expect(wrapper.emitted('openChange')?.at(-1)?.[1]).toBeInstanceOf(MouseEvent)
    expect(wrapper.emitted('visibleChange')?.at(-1)?.[1]).toBeInstanceOf(MouseEvent)
  })

  it('emits confirm events on button clicks without explicit handlers', async () => {
    const confirmWrapper = trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', trigger: 'click' },
      slots: { default: () => h('span', 'Delete') },
    }))

    await confirmWrapper.find('.ant-trigger-wrapper').trigger('click')
    await flushPopup()
    getButtons()[1]?.click()
    await flushPopup()

    expect(confirmWrapper.emitted('confirm')?.at(-1)?.[0]).toBeInstanceOf(MouseEvent)
  })

  it('emits cancel events on button clicks without explicit handlers', async () => {
    const cancelWrapper = trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', open: true },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()
    getButtons()[0]?.click()
    await flushPopup()

    expect(cancelWrapper.emitted('cancel')?.at(-1)?.[0]).toBeInstanceOf(MouseEvent)
  })

  it('keeps template confirm and cancel listeners working in controlled mode', async () => {
    const confirm = vi.fn()
    const cancel = vi.fn()

    trackMount(mount(defineComponent({
      components: { Popconfirm },
      setup() {
        const open = ref(false)

        const handleOpenChange = (value: boolean) => {
          open.value = value
        }

        const handleConfirm = () => {
          confirm()
          open.value = false
        }

        const handleCancel = () => {
          cancel()
          open.value = false
        }

        return {
          open,
          handleOpenChange,
          handleConfirm,
          handleCancel,
        }
      },
      template: `
        <Popconfirm
          :open="open"
          title="Are you sure?"
          trigger="click"
          @openChange="handleOpenChange"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        >
          <span>Delete</span>
        </Popconfirm>
      `,
    }), {
      attachTo: document.body,
    }))

    const trigger = document.body.querySelector('.ant-trigger-wrapper') as HTMLElement | null
    trigger?.click()
    await flushPopup()

    getButtons()[1]?.click()
    await flushPopup()

    expect(confirm).toHaveBeenCalledTimes(1)
    expect(getPopup()?.style.display).toBe('none')

    trigger?.click()
    await flushPopup()

    getButtons()[0]?.click()
    await flushPopup()

    expect(cancel).toHaveBeenCalledTimes(1)
    expect(getPopup()?.style.display).toBe('none')
  })

  it('supports once modifiers on confirm listeners', async () => {
    const confirm = vi.fn()

    trackMount(mount(defineComponent({
      components: { Popconfirm },
      setup() {
        const open = ref(false)

        const handleOpenChange = (value: boolean) => {
          open.value = value
        }

        return {
          open,
          confirm,
          handleOpenChange,
        }
      },
      template: `
        <Popconfirm
          :open="open"
          title="Are you sure?"
          trigger="click"
          @openChange="handleOpenChange"
          @confirm.once="confirm"
        >
          <span>Delete</span>
        </Popconfirm>
      `,
    }), {
      attachTo: document.body,
    }))

    const trigger = document.body.querySelector('.ant-trigger-wrapper') as HTMLElement | null

    trigger?.click()
    await flushPopup()
    getButtons()[1]?.click()
    await flushPopup()

    trigger?.click()
    await flushPopup()
    getButtons()[1]?.click()
    await flushPopup()

    expect(confirm).toHaveBeenCalledTimes(1)
  })

  it('treats open=null as uncontrolled', async () => {
    const wrapper = trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', trigger: 'click', open: null },
      slots: { default: () => h('span', 'Delete') },
    }))

    await wrapper.find('.ant-trigger-wrapper').trigger('click')
    await flushPopup()

    expect(getPopup()).not.toBeNull()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
  })

  it('treats explicit open=undefined as controlled false', async () => {
    const wrapper = trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', trigger: 'click', open: undefined },
      slots: { default: () => h('span', 'Delete') },
    }))

    await wrapper.find('.ant-trigger-wrapper').trigger('click')
    await flushPopup()

    expect(getPopup()).toBeNull()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = trackMount(mount(Popconfirm, {
      props: { title: 'Are you sure?', disabled: true },
      slots: { default: () => h('span', 'Delete') },
    }))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('supports icon prop', async () => {
    trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', open: true, icon: QuestionCircleOutlined },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()
    expect(document.body.querySelector('[data-icon="question-circle"]')).not.toBeNull()
  })

  it('opens on click and exposes popup dom node', async () => {
    const wrapper = trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', trigger: 'click' },
      slots: { default: () => h('span', 'Delete') },
    }))

    expect(getPopup()).toBeNull()

    await wrapper.find('.ant-trigger-wrapper').trigger('click')
    await flushPopup()

    const popup = getPopup()
    expect(popup).not.toBeNull()
    expect(popup?.style.display).not.toBe('none')
    expect((wrapper.vm as { getPopupDomNode: () => HTMLElement | null }).getPopupDomNode()).toBe(popup)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true, undefined])
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([true])
    expect(wrapper.emitted('visibleChange')?.[0]).toEqual([true, undefined])
  })

  it('does not open when disabled', async () => {
    const wrapper = trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', trigger: 'click', disabled: true },
      slots: { default: () => h('span', 'Delete') },
    }))

    await wrapper.find('.ant-trigger-wrapper').trigger('click')
    await flushPopup()

    expect(getPopup()).toBeNull()
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('closes on escape without emitting cancel', async () => {
    const wrapper = trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', defaultOpen: true },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()
    expect(getPopup()?.style.display).not.toBe('none')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPopup()

    expect(getPopup()?.style.display).toBe('none')
    expect(wrapper.emitted('cancel')).toBeUndefined()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    expect(wrapper.emitted('openChange')?.at(-1)?.[1]).toBeInstanceOf(KeyboardEvent)
    expect(wrapper.emitted('visibleChange')?.at(-1)?.[1]).toBeInstanceOf(KeyboardEvent)
  })

  it('keeps popup open and shows loading until async confirm resolves', async () => {
    vi.useFakeTimers()
    const confirm = vi.fn(
      () => new Promise(resolve => {
        setTimeout(resolve, 100)
      }),
    )
    const wrapper = trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', trigger: 'click', onConfirm: confirm },
      slots: { default: () => h('span', 'Delete') },
    }))
    await wrapper.find('.ant-trigger-wrapper').trigger('click')
    await flushPopup()

    const okButton = getButtons()[1]
    expect(okButton).toBeDefined()

    okButton?.click()
    await flushPopup()

    expect(confirm).toHaveBeenCalledTimes(1)
    expect((wrapper.vm as { getPopupDomNode: () => HTMLElement | null }).getPopupDomNode()?.style.display).not.toBe('none')
    expect(getButtons()[1]?.className).toContain('ant-btn-loading')

    await vi.advanceTimersByTimeAsync(100)
    await Promise.resolve()
    await nextTick()
    await flushPopup()

    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    expect(wrapper.emitted('openChange')?.at(-1)?.[1]).toBeInstanceOf(MouseEvent)
    expect(wrapper.emitted('visibleChange')?.at(-1)?.[1]).toBeInstanceOf(MouseEvent)
  })

  it('passes legacy-compatible props into custom button slots', async () => {
    let receivedCancelSlotProps: PopconfirmCancelButtonSlotProps | undefined
    let receivedOkSlotProps: PopconfirmOkButtonSlotProps | undefined

    trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: {
        title: 'Are you sure?',
        open: true,
        cancelButtonProps: { shape: 'round' },
        okButtonProps: { danger: true },
      },
      slots: {
        default: () => h('span', 'Delete'),
        cancelButton: slotProps => {
          receivedCancelSlotProps = slotProps
          return h('button', { class: 'custom-cancel', onClick: slotProps.onClick }, 'Cancel')
        },
        okButton: slotProps => {
          receivedOkSlotProps = slotProps
          return h('button', { class: 'custom-ok', onClick: slotProps.onClick }, 'OK')
        },
      },
    }))

    await flushPopup()

    expect(receivedCancelSlotProps?.size).toBe('small')
    expect(receivedCancelSlotProps?.shape).toBe('round')
    expect(typeof receivedCancelSlotProps?.onClick).toBe('function')
    expect(typeof receivedCancelSlotProps?.cancel).toBe('function')
    expect(receivedOkSlotProps?.size).toBe('small')
    expect(receivedOkSlotProps?.type).toBe('primary')
    expect(receivedOkSlotProps?.danger).toBe(true)
    expect(typeof receivedOkSlotProps?.onClick).toBe('function')
    expect(typeof receivedOkSlotProps?.confirm).toBe('function')
  })

  it('keeps custom cancel button prop click handlers when slot props invoke cancel', async () => {
    const cancelButtonClick = vi.fn()

    trackMount(mount(defineComponent({
      components: { Popconfirm },
      setup() {
        const open = ref(true)

        return {
          open,
          cancelButtonClick,
        }
      },
      template: `
        <div>
          <Popconfirm
            :open="open"
            title="Are you sure?"
            :cancelButtonProps="{ onClick: cancelButtonClick }"
            @openChange="open = $event"
          >
            <template #cancelButton="slotProps">
              <button class="custom-cancel" @click="slotProps.onClick">Cancel</button>
            </template>
            <span>Delete</span>
          </Popconfirm>
        </div>
      `,
    }), {
      attachTo: document.body,
    }))

    await flushPopup()

    ;(document.body.querySelector('.custom-cancel') as HTMLButtonElement | null)?.click()
    await flushPopup()

    expect(cancelButtonClick).toHaveBeenCalledTimes(1)
    expect(getPopup()?.style.display).toBe('none')
  })

  it('keeps default cancel button prop click handlers', async () => {
    const firstCancelClick = vi.fn()
    const secondCancelClick = vi.fn()
    const wrapper = trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: {
        title: 'Are you sure?',
        defaultOpen: true,
        cancelButtonProps: {
          onClick: [firstCancelClick, secondCancelClick],
        } as any,
      },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()

    getButtons()[0]?.click()
    await flushPopup()

    expect(firstCancelClick).toHaveBeenCalledTimes(1)
    expect(secondCancelClick).toHaveBeenCalledTimes(1)
    expect((wrapper.vm as { getPopupDomNode: () => HTMLElement | null }).getPopupDomNode()?.style.display).toBe('none')
  })

  it('keeps custom ok button prop click handlers when slot props invoke confirm', async () => {
    const okButtonClick = vi.fn()

    trackMount(mount(defineComponent({
      components: { Popconfirm },
      setup() {
        const open = ref(true)

        return {
          open,
          okButtonClick,
        }
      },
      template: `
        <Popconfirm
          :open="open"
          title="Are you sure?"
          :okButtonProps="{ onClick: okButtonClick }"
          @openChange="open = $event"
        >
          <template #okButton="slotProps">
            <button class="custom-ok" @click="slotProps.onClick">OK</button>
          </template>
          <span>Delete</span>
        </Popconfirm>
      `,
    }), {
      attachTo: document.body,
    }))

    await flushPopup()

    ;(document.body.querySelector('.custom-ok') as HTMLButtonElement | null)?.click()
    await flushPopup()

    expect(okButtonClick).toHaveBeenCalledTimes(1)
    expect(getPopup()?.style.display).toBe('none')
  })

  it('keeps default ok button prop click handlers', async () => {
    const firstOkClick = vi.fn()
    const secondOkClick = vi.fn()
    const wrapper = trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: {
        title: 'Are you sure?',
        defaultOpen: true,
        okButtonProps: {
          onClick: [firstOkClick, secondOkClick],
        } as any,
      },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()

    getButtons()[1]?.click()
    await flushPopup()

    expect(firstOkClick).toHaveBeenCalledTimes(1)
    expect(secondOkClick).toHaveBeenCalledTimes(1)
    expect((wrapper.vm as { getPopupDomNode: () => HTMLElement | null }).getPopupDomNode()?.style.display).toBe('none')
  })

  it('resets confirm loading when controlled open closes externally', async () => {
    const confirm = vi.fn(() => new Promise(() => {}))
    const wrapper = trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: {
        title: 'Are you sure?',
        open: true,
        onConfirm: confirm,
      },
      slots: { default: () => h('span', 'Delete') },
    }))

    await flushPopup()

    getButtons()[1]?.click()
    await flushPopup()

    expect(confirm).toHaveBeenCalledTimes(1)
    expect(getButtons()[1]?.className).toContain('ant-btn-loading')

    await wrapper.setProps({ open: false })
    await flushPopup()

    await wrapper.setProps({ open: true })
    await flushPopup()

    expect(getButtons()[1]?.className ?? '').not.toContain('ant-btn-loading')
  })

  it('supports icon slot', async () => {
    trackMount(mount(Popconfirm, {
      attachTo: document.body,
      props: { title: 'Are you sure?', open: true },
      slots: {
        default: () => h('span', 'Delete'),
        icon: () => h('span', { class: 'custom-icon' }, '?'),
      },
    }))

    await flushPopup()
    expect(getPopup()?.querySelector('.custom-icon')).not.toBeNull()
  })
})
