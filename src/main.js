import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'

const app = createApp(App)



const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const head = createHead()


app.use(pinia)
app.use(router)
app.use(head)

app.mount('#app')
