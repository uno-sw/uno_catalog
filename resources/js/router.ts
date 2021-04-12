import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import ProductList from './pages/ProductList.vue'
import Login from './pages/Login.vue'
import ProductEdit from './pages/product/Edit.vue'
import NotFound from './pages/errors/NotFound.vue'
import SystemError from './pages/errors/System.vue'

import store from './store'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: ProductList,
    meta: { auth: true },
    props: route => {
      const numberRegex = /^[1-9][0-9]*$/

      const pageQuery = route.query.page
      const page = typeof pageQuery === 'string' && numberRegex.test(pageQuery)
          ? Number(pageQuery)
          : null

      const tagsQuery = route.query.tags
      let tags: number[]
      if (Array.isArray(tagsQuery)) {
        tags = tagsQuery.reduce<number[]>((prev, value) => {
          if (value && numberRegex.test(value)) {
            prev.push(Number(value))
          }
          return prev
        }, [])
      } else {
        tags = tagsQuery && numberRegex.test(tagsQuery)
            ? [Number(tagsQuery)]
            : []
      }
      return {
        page,
        tags,
        sort: route.query.sort,
        order: route.query.order,
      }
    },
  },
  {
    path: '/login',
    component: Login,
    meta: { guest: true },
  },
  {
    path: '/products/:id/edit',
    component: ProductEdit,
    props: true,
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
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes,
})

router.beforeEach((to, from, next) => {
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
})

export default router
