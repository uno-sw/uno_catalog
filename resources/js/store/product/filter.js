const state = {
  tags: [],
}

const getters = {
  tags: state => state.tags,
}

const mutations = {
  setTags(state, tags) {
    state.tags = tags
  },
}

const actions = {
  setTags(context, tags) {
    tags = tags.filter(
      tag => context.rootGetters['product/tag/tags'].some(t => t.id == tag),
    )
    context.commit('setTags', tags)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
