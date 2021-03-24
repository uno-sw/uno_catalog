import Vue from 'vue'
import VueRouter from 'vue-router'

import ProductList from './pages/ProductList.vue'
import Login from './pages/Login.vue'
import ProductDetail from './pages/product/Detail.vue'
import ProductEdit from './pages/product/Edit.vue'
import RegisterProduct from './pages/product/Register.vue'
import NotFound from './pages/errors/NotFound.vue'
import SystemError from './pages/errors/System.vue'

import store from './store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: ProductList,
    meta: { auth: true },
    props: route => {
      const numberRegex = /^[1-9][0-9]*$/
      const page = route.query.page
      let tags = route.query.tags
      if (Array.isArray(tags)) {
        tags = tags.reduce((prev, value) => {
          if (numberRegex.test(value)) {
            prev.push(Number(value))
          }
          return prev
        }, [])
      } else {
        tags = numberRegex.test(tags) ? [Number(tags)] : []
      }
      return {
        page: /^[1-9][0-9]*$/.test(page) ? Number(page) : null,
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
    path: '/products/register',
    component: RegisterProduct,
    meta: { auth: true },
  },
  {
    path: '/products/:id',
    component: ProductDetail,
    props: true,
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
  }

  if (to.matched.some(record => record.meta.guest)) {
    if (store.getters['auth/check']) {
      next('/')
    } else {
      next()
    }
  }

  next()
})

export default router
