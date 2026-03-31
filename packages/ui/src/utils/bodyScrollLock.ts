type BodyScrollStyleSnapshot = {
  overflow: string
  paddingRight: string
}

let bodyScrollLockCount = 0
const bodyScrollOriginStyle: BodyScrollStyleSnapshot = {
  overflow: '',
  paddingRight: '',
}

function captureBodyScrollStyle() {
  bodyScrollOriginStyle.overflow = document.body.style.overflow
  bodyScrollOriginStyle.paddingRight = document.body.style.paddingRight
}

function clearBodyScrollStyleSnapshot() {
  bodyScrollOriginStyle.overflow = ''
  bodyScrollOriginStyle.paddingRight = ''
}

export function lockBodyScroll() {
  if (typeof document === 'undefined') return

  if (bodyScrollLockCount === 0) {
    captureBodyScrollStyle()

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    const computedPaddingRight = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0

    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight =
      scrollBarWidth > 0 ? `${computedPaddingRight + scrollBarWidth}px` : bodyScrollOriginStyle.paddingRight
  }

  bodyScrollLockCount += 1
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined' || bodyScrollLockCount === 0) return

  bodyScrollLockCount -= 1

  if (bodyScrollLockCount === 0) {
    document.body.style.overflow = bodyScrollOriginStyle.overflow
    document.body.style.paddingRight = bodyScrollOriginStyle.paddingRight
    clearBodyScrollStyleSnapshot()
  }
}