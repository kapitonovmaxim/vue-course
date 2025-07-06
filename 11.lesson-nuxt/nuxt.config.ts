// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  // devtools: { enabled: true },
  modules: ['@nuxt/image', 'nuxt-quasar-ui'],
  css: [
    '@quasar/extras/material-icons/material-icons.css',
    '~/assets/css/quasar.variables.scss',
    'quasar/src/css/index.sass',
    './assets/custom.scss'
  ],
  quasar: {
    plugins: [
      'BottomSheet',
      'Dialog',
      'Loading',
      'LoadingBar',
      'Notify',
      'Dark',
    ],
    extras: {
      font: 'roboto-font',
    },
    components: {
      defaults: {
        QBtn: {
          unelevated: true,
        },
      },
    },
  },
})