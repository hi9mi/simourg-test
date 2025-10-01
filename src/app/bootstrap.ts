import { createApp } from 'vue'
import { routesMap } from '@/pages'
import { initWith } from './init-with'
import MainApp from './main-app.vue'

interface Params {
  baseUrl: string
}

export function bootstrap({ baseUrl }: Params) {
  const app = createApp(MainApp)

  initWith.pinia(app)
  const router = initWith.router({
    app,
    routesMap,
    baseUrl,
  })

  const isReady = router.isReady()

  return {
    isReady,
    mount: (selector: string) => app.mount(selector),
  }
}
