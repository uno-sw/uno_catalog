const state = {
  code: null,
  message: '',
}

const mutations = {
  setCode(state, code) {
    state.code = code
  },
  setMessage(state, message) {
    state.message = message
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}
