import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from './store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes,
})

export function beforeEach(to, from, next) {
  if (to.matched.some(record => record.meta.auth)) {
    if (store.getters['auth/check']) {
      next()
    } else {
      store.commit('auth/setForwardingRoute', to)
      next('/login')
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (store.getters['auth/check']) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
}

router.beforeEach((to, from, next) => beforeEach(to, from, next))

export default router
