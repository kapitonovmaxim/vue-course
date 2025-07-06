import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
    config: {
      dark: false // или true для темной темы
    }
  })
})