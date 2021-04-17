import filter from './filter'
import pagination from './pagination'
import sort from './sort'
import tag from './tag'
import client from '../../client'
import { OK } from '../../util'

const state = {
  products: [],
  isLoading: false,
}

const getters = {
  products: state => state.products,
  isLoading: state => state.isLoading,
}

const mutations = {
  setProducts(state, products) {
    state.products = products
  },
  setIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
}

const actions = {
  async fetchProducts(context, page) {
    const wait = new Promise(resolve => setTimeout(() => resolve(), 1000))
    const request = client.get(
      '/api/products',
      {
        params: {
          tags: context.rootGetters['product/filter/tags'],
          sort: context.rootGetters['product/sort/sort'],
          order: context.rootGetters['product/sort/order'],
          page: page ? page : 1,
        },
      },
    )

    context.commit('setIsLoading', true)
    const [, response] = await Promise.all([wait, request])
    context.commit('setIsLoading', false)

    if (!response) {
      context.commit('error/setCode', 0, { root: true })
      context.commit(
        'error/setMessage',
        'ネットワークに接続されていません',
        { root: true },
      )
      return
    }

    if (response.status === OK) {
      context.commit('setProducts', response.data.data)
      context.commit(
        'product/pagination/setCurrentPage',
        response.data.meta.current_page,
        { root: true },
      )
      context.commit(
        'product/pagination/setLastPage',
        response.data.meta.last_page,
        { root: true },
      )
      return
    }

    context.commit('error/setCode', response.status, { root: true })
    context.commit(
      'error/setMessage',
      '製品の読み込みに失敗しました',
      { root: true },
    )
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    filter,
    pagination,
    sort,
    tag,
  },
}
