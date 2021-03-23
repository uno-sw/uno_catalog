import axios from "axios"

import { OK, UNPROCESSABLE_ENTITY } from '../util'

const state = {
  user: null,
  apiStatus: null,
  loginErrorMessages: null,
  forwardingRoute: null,
  isProcessing: false,
}

const getters = {
  check: state => !!state.user,
  username: state => state.user ? state.user.name : '',
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
  setIsProcessing(state, isProcessing) {
    state.isProcessing = isProcessing
  }
}

const actions = {
  async login(context, data) {
    context.commit('setApiStatus', null)
    context.commit('setIsProcessing', true)
    await axios.get('/sanctum/csrf-cookie')
    const wait = new Promise(resolve => setTimeout(() => resolve(), 1000))
    const login = axios.post('/api/login', data)
    const [, response] = await Promise.all([wait, login])
    context.commit('setIsProcessing', false)

    if (response.status === OK) {
      context.commit('setApiStatus', true)
      context.commit('setUser', response.data)
      return false
    }

    context.commit('setApiStatus', false)
    if (response.status === UNPROCESSABLE_ENTITY) {
      context.commit('setLoginErrorMessages', response.data.errors)
    } else {
      context.commit('error/setCode', response.status, { root: true })
      context.commit(
        'error/setMessage',
        'ログイン中にエラーが発生しました',
        { root: true },
      )
    }
  },
  async logout(context) {
    context.commit('setApiStatus', null)
    const response = await axios.post('/api/logout')

    if (response.status === OK) {
      context.commit('setApiStatus', true)
      context.commit('setUser', null)
      return false
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
    const response = await axios.get('/api/user')
    const user = response.data || null

    if (response.status === OK) {
      context.commit('setApiStatus', true)
      context.commit('setUser', user)
      return false
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
