const sortOptions = ['created_at', 'updated_at', 'price', 'name']
const orderOptions = ['asc', 'desc']

const state = {
  sort: 'created_at',
  order: 'desc',
}

const getters = {
  sort: state => state.sort,
  order: state => state.order,
}

const mutations = {
  setSort(state, sort) {
    if (sortOptions.includes(sort)) {
      state.sort = sort
    }
  },
  setOrder(state, order) {
    if (orderOptions.includes(order)) {
      state.order = order
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
}
