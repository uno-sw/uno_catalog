import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import router from './router'
import App from './App.vue'

Vue.use(Vuetify)

new Vue({
  el: '#app',
  router,
  vuetify: new Vuetify(),
  components: { App },
  template: '<App />',
})
