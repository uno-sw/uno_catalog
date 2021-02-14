import Vue from 'vue'
import VueRouter from 'vue-router'

import EntryList from './pages/EntryList.vue'
import Login from './pages/Login.vue'
import CreateProduct from './pages/product/Create.vue'
import NotFound from './pages/errors/NotFound.vue'
import SystemError from './pages/errors/System.vue'

import store from './store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: EntryList,
    meta: { auth: true },
  },
  {
    path: '/login',
    component: Login,
    meta: { guest: true },
  },
  {
    path: '/products/create',
    component: CreateProduct,
    meta: { auth: true },
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

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    if (store.getters['auth/check']) {
      next()
    } else {
      store.commit('auth/setForwardingRoute', to)
      next('/login')
    }
  }

  if (to.matched.some(record => record.meta.guest)) {
    if (store.getters['auth/check']) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
