import { createApp } from 'vue'
import { createPinia } from 'pinia'
import storage from 'pinia-plugin-storage'
import App from './App.vue'

const app = createApp(App)

const pinia = createPinia()

pinia.use(storage)

app.use(pinia)

app.mount('#app')
