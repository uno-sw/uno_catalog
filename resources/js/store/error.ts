import { DefineGetters, DefineMutations } from 'vuex-type-helper'
import { ErrorGetters, ErrorMutations, ErrorState } from '../types/store/error'

const state: ErrorState = {
  code: null,
  message: '',
}

const getters: DefineGetters<ErrorGetters, ErrorState> = {
  code: state => state.code,
  message: state => state.message,
}

const mutations: DefineMutations<ErrorMutations, ErrorState> = {
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
  getters,
  mutations,
}
