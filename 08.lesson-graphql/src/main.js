import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from '@/client/apollo-client'

import App from './App.vue'

const pinia = createPinia()
import router from './router'
const app = createApp(App);


app
    .provide(DefaultApolloClient, apolloClient)
    .use(router)
    .use(pinia)
    .mount('#app')
