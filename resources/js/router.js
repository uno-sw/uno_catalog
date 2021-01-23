import Vue from 'vue'
import VueRouter from 'vue-router'

import EntryList from './pages/EntryList.vue'
import Login from './pages/Login.vue'
import NotFound from './pages/errors/NotFound.vue'
import SystemError from './pages/errors/System.vue'

import store from './store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: EntryList,
    beforeEnter(to, from, next) {
      if (!store.getters['auth/check']) {
        next('/login')
      } else {
        next()
      }
    }
  },
  {
    path: '/login',
    component: Login,
    beforeEnter(to, from, next) {
      if (store.getters['auth/check']) {
        next('/')
      } else {
        next()
      }
    },
  },
  {
    path: '/500',
    component: SystemError,
  },
  {
    path: '*',
    component: NotFound,
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
