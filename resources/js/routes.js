import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import ProductEdit from './pages/product/Edit.vue'
import NotFound from './pages/errors/NotFound.vue'
import SystemError from './pages/errors/System.vue'

export default [
  {
    path: '/',
    component: Home,
    meta: { auth: true },
  },
  {
    path: '/login',
    component: Login,
    meta: { guest: true },
  },
  {
    path: '/products/:id/edit',
    component: ProductEdit,
    meta: { auth: true },
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
