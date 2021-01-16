import Vue from 'vue'
import VueRouter from 'vue-router'

import EntryList from './pages/EntryList.vue'
import Login from './pages/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: EntryList,
  },
  {
    path: '/login',
    component: Login,
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
