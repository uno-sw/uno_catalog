import client from '../client'
import { OK, UNPROCESSABLE_ENTITY } from '../util'

const state = {
  user: null,
  apiStatus: null,
  loginErrorMessages: null,
  forwardingRoute: null,
}

const getters = {
  check: state => !!state.user,
  username: state => state.user ? state.user.name : '',
  apiStatus: state => state.apiStatus,
  loginErrorMessages: state => state.loginErrorMessages,
  forwardingRoute: state => state.forwardingRoute,
}

const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setApiStatus(state, status) {
    state.apiStatus = status
  },
  setLoginErrorMessages(state, messages) {
    state.loginErrorMessages = messages
  },
  setForwardingRoute(state, route) {
    state.forwardingRoute = route
  },
}

const actions = {
  async login(context, data) {
    const wait = new Promise(resolve => setTimeout(() => resolve(), 1000))
    const login = client.post('/api/login', data)

    context.commit('setApiStatus', null)

    await client.get('/sanctum/csrf-cookie')
    const [, response] = await Promise.all([wait, login])

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
      context.commit('setApiStatus', true)
      context.commit('setUser', response.data)
      return
    }

    context.commit('setApiStatus', false)

    if (response.status === UNPROCESSABLE_ENTITY) {
      context.commit('setLoginErrorMessages', response.data.errors)
      return
    }

    context.commit('error/setCode', response.status, { root: true })
    context.commit(
      'error/setMessage',
      'ログイン中にエラーが発生しました',
      { root: true },
    )
  },
  async logout(context) {
    context.commit('setApiStatus', null)
    const response = await client.post('/api/logout')

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
      context.commit('setApiStatus', true)
      context.commit('setUser', null)
      return
    }

    context.commit('setApiStatus', false)
    context.commit('error/setCode', response.status, { root: true })
    context.commit(
      'error/setMessage',
      'ログアウト中にエラーが発生しました',
      { root: true },
    )
  },
  async currentUser(context) {
    context.commit('setApiStatus', null)
    const response = await client.get('/api/user')

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
      context.commit('setApiStatus', true)
      context.commit('setUser', response.data || null)
      return
    }

    context.commit('setApiStatus', false)
    context.commit('error/setCode', response.status, { root: true })
    context.commit(
      'error/setMessage',
      'ユーザーの取得に失敗しました',
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
}
