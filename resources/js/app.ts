import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import bootstrap from './bootstrap'
import router from './router'
import store from './store'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

bootstrap()

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

const createApp = async () => {
  await store.dispatch('auth/currentUser')

  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App />',
  })
}

createApp()
