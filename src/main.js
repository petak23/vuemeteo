import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import {createBootstrap} from 'bootstrap-vue-next'

// Add the necessary CSS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import '@mdi/font/css/materialdesignicons.css'

import './assets/main.scss'
import './color-modes'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createBootstrap()) 

app.mount('#app')
