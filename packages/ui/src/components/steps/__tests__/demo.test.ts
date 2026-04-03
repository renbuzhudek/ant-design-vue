import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Basic from '../demo/basic.vue'
import Small from '../demo/small.vue'
import Vertical from '../demo/vertical.vue'
import Error from '../demo/error.vue'
import Simple from '../demo/simple.vue'
import SmallSize from '../demo/small-size.vue'
import Icon from '../demo/icon.vue'
import Clickable from '../demo/clickable.vue'
import VerticalSmall from '../demo/vertical-small.vue'
import StepNext from '../demo/step-next.vue'
import Nav from '../demo/nav.vue'
import ProgressDot from '../demo/progress-dot.vue'
import Progress from '../demo/progress.vue'
import LabelPlacement from '../demo/label-placement.vue'
import CustomizedProgressDot from '../demo/customized-progress-dot.vue'
import Inline from '../demo/inline.vue'

const demos = {
  Basic,
  Small,
  Vertical,
  Error,
  Simple,
  SmallSize,
  Icon,
  Clickable,
  VerticalSmall,
  StepNext,
  Nav,
  ProgressDot,
  Progress,
  LabelPlacement,
  CustomizedProgressDot,
  Inline,
}

describe('Steps demos', () => {
  Object.entries(demos).forEach(([name, component]) => {
    it(`demo: ${name}`, () => {
      const wrapper = mount(component)
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
