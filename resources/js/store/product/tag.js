import client from '../../client'
import { OK } from '../../util'

const state = {
  tags: [],
  apiStatus: null,
}

const getters = {
  tags: state => state.tags,
  apiStatus: state => state.apiStatus,
}

const mutations = {
  setTags(state, tags) {
    state.tags = tags
  },
  deleteTag(state, id) {
    state.tags = state.tags.filter(tag => tag.id != id)
  },
  setApiStatus(state, apiStatus) {
    state.apiStatus = apiStatus
  },
}

const actions = {
  async fetchTags(context) {
    const response = await client.get('/api/tags')

    if (!response) {
      context.commit('setTags', [])
      context.commit('error/setCode', 0, { root: true })
      context.commit(
        'error/setMessage',
        'ネットワークに接続されていません',
        { root: true },
      )
      return
    }

    if (response.status === OK) {
      context.commit('setTags', response.data.data)
      return
    }

    context.commit('setTags', [])
    context.commit('error/setCode', response.status, { root: true })
    context.commit(
      'error/setMessage',
      'タグの読み込みに失敗しました',
      { root: true },
    )
  },
  async deleteTag(context, id) {
    context.commit('setApiStatus', null)

    const response = await client.delete(`/api/tags/${id}`)

    if (!response) {
      context.commit('setApiStatus', false)
      context.commit('error/setCode', 0, { root: true })
      context.commit(
        'error/setMessage',
        'ネットワークに接続されていません',
        { root: true },
      )
      return
    }

    if (response.status === OK) {
      context.commit('deleteTag', id)
      context.commit('setApiStatus', true)
      return
    }

    context.commit('setApiStatus', false)
    context.commit('error/setCode', response.status, { root: true })
    context.commit('error/setMessage', 'タグの削除に失敗しました', { root: true })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
