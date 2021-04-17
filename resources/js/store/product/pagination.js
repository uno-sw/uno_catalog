const state = {
  currentPage: 0,
  lastPage: 0,
}

const getters = {
  currentPage: state => state.currentPage,
  lastPage: state => state.lastPage,
}

const mutations = {
  setCurrentPage(state, currentPage) {
    state.currentPage = currentPage
  },
  setLastPage(state, lastPage) {
    state.lastPage = lastPage
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
}
