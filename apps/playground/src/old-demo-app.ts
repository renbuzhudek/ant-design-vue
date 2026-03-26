import { createApp, h, defineAsyncComponent } from 'vue'
import antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import entries from 'virtual:old-demo-glob'

const params = new URLSearchParams(location.search)
const comp = params.get('component')
const demo = params.get('demo')

const entry = (entries as any[]).find(e => e.component === comp && e.name === demo)

if (entry) {
  const Demo = defineAsyncComponent({
    loader: () => entry.load().then((m: any) => m.default || m),
    onError(err) {
      console.warn(`[old-demo] Failed to load ${comp}/${demo}:`, err)
    },
  })

  const app = createApp({ render: () => h(Demo) })
  app.use(antd)
  app.mount('#app')

  // Notify parent of content height for auto-resize
  const notify = () => {
    window.parent.postMessage(
      { type: 'old-demo-resize', height: document.body.scrollHeight },
      '*',
    )
  }
  const observer = new ResizeObserver(notify)
  observer.observe(document.body)
  // Also notify after a short delay for CSS-in-JS styles to settle
  setTimeout(notify, 500)
} else {
  document.getElementById('app')!.innerHTML = `<div style="color:#999;font-style:italic">Demo not found: ${comp}/${demo}</div>`
}
