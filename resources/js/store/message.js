const state = {
  content: '',
  variant: 'success',
  dismissible: false,
}

const mutations = {
  setMessage(state, { content, variant, dismissible }) {
    state.content = content

    if (typeof variant !== 'undefined') {
      state.variant = variant
    }

    if (typeof dismissible !== 'undefined') {
      state.dismissible = dismissible
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}
