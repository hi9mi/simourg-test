import { bootstrap } from './bootstrap'

function main() {
  const { BASE_URL } = import.meta.env

  const app = bootstrap({
    baseUrl: BASE_URL,
  })

  app.isReady.then(() => {
    app.mount('#app')
  })
  app.isReady.catch(console.error)
}

main()
