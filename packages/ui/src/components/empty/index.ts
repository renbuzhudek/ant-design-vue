import { markRaw, type App, type Plugin } from 'vue'
import type { EmptyComponentStatics, EmptyImageComponent } from './types'
import Empty from './Empty.vue'
import DefaultEmpty from './DefaultEmpty.vue'
import SimpleEmpty from './SimpleEmpty.vue'
import './style/index.css'

export { default as DefaultEmpty } from './DefaultEmpty.vue'
export { default as SimpleEmpty } from './SimpleEmpty.vue'
export * from './types'

const defaultImage = markRaw(DefaultEmpty as EmptyImageComponent)
const simpleImage = markRaw(SimpleEmpty as EmptyImageComponent)
const EmptyWithStatics = Empty as typeof Empty & Plugin & EmptyComponentStatics

defaultImage.PRESENTED_IMAGE_DEFAULT = true
simpleImage.PRESENTED_IMAGE_SIMPLE = true

// Static properties for convenience
export const PRESENTED_IMAGE_DEFAULT = defaultImage
export const PRESENTED_IMAGE_SIMPLE = simpleImage

EmptyWithStatics.PRESENTED_IMAGE_DEFAULT = defaultImage
EmptyWithStatics.PRESENTED_IMAGE_SIMPLE = simpleImage
EmptyWithStatics.install = function (app: App) {
  app.component('AEmpty', EmptyWithStatics)
  return app
}

export { EmptyWithStatics as Empty }

export default EmptyWithStatics
