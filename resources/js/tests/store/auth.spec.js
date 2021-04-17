import AxiosMock from 'axios-mock-adapter'
import client from '../../client'
import authStore from '../../store/auth'

const axiosMock = new AxiosMock(client)

describe('auth store', () => {
  describe('login', () => {
    it('should login', async () => {
      const commit = jest.fn()
      const user = {
        id: 1,
        name: 'Test',
        email: 'test@example.com',
        password: 'test1234',
      }
      axiosMock.onGet('/sanctum/csrf-cookie').reply(200)
      axiosMock.onPost('/api/login').reply(200, user)

      await authStore.actions.login({ commit }, {
        email: user.email,
        password: user.password,
      })

      expect(commit).toHaveBeenCalledWith('setApiStatus', true)
      expect(commit).toHaveBeenCalledWith('setUser', user)
    })

    it('should handle validation error', async () => {
      const commit = jest.fn()
      const errors = {
        email: ['Email is required.'],
        password: ['Password is required.'],
      }
      axiosMock.onGet('/sanctum/csrf-cookie').reply(200)
      axiosMock.onPost('/api/login').reply(422, { errors })

      await authStore.actions.login({ commit })

      expect(commit).toHaveBeenCalledWith('setApiStatus', false)
      expect(commit).toHaveBeenCalledWith('setLoginErrorMessages', errors)
    })

    it('should handle server error', async () => {
      const commit = jest.fn()
      axiosMock.onGet('/sanctum/csrf-cookie').reply(200)
      axiosMock.onPost('/api/login').reply(500)

      await authStore.actions.login({ commit })

      expect(commit).toHaveBeenCalledWith('setApiStatus', false)
      expect(commit).toHaveBeenCalledWith('error/setCode', 500, { root: true })
    })

    it('should handle network error', async () => {
      const commit = jest.fn()
      axiosMock.onGet('/sanctum/csrf-cookie').reply(200)
      axiosMock.onPost('/api/login').networkError()

      await authStore.actions.login({ commit })

      expect(commit).toHaveBeenCalledWith('setApiStatus', false)
      expect(commit).toHaveBeenCalledWith('error/setCode', 0, { root: true })
    })

    it('should handle timeout error', async () => {
      const commit = jest.fn()
      axiosMock.onGet('/sanctum/csrf-cookie').reply(200)
      axiosMock.onPost('/api/login').timeout()

      await authStore.actions.login({ commit })

      expect(commit).toHaveBeenCalledWith('setApiStatus', false)
      expect(commit).toHaveBeenCalledWith('error/setCode', 0, { root: true })
    })
  })

  describe('logout', () => {
    it('should logout', async () => {
      const commit = jest.fn()
      axiosMock.onPost('/api/logout').reply(200)

      await authStore.actions.logout({ commit })

      expect(commit).toHaveBeenCalledWith('setApiStatus', true)
      expect(commit).toHaveBeenCalledWith('setUser', null)
    })

    it('should handle server error', async () => {
      const commit = jest.fn()
      axiosMock.onPost('/api/logout').reply(500)

      await authStore.actions.logout({ commit })

      expect(commit).toHaveBeenCalledWith('setApiStatus', false)
      expect(commit).toHaveBeenCalledWith('error/setCode', 500, { root: true })
    })

    it('should handle network error', async () => {
      const commit = jest.fn()
      axiosMock.onPost('/api/logout').networkError()

      await authStore.actions.logout({ commit })

      expect(commit).toHaveBeenCalledWith('setApiStatus', false)
      expect(commit).toHaveBeenCalledWith('error/setCode', 0, { root: true })
    })

    it('should handle timeout error', async () => {
      const commit = jest.fn()
      axiosMock.onPost('/api/logout').timeout()

      await authStore.actions.logout({ commit })

      expect(commit).toHaveBeenCalledWith('setApiStatus', false)
      expect(commit).toHaveBeenCalledWith('error/setCode', 0, { root: true })
    })
  })

  describe('currentUser', () => {
    it('should fetch current user', async () => {
      const commit = jest.fn()
      const user = {
        id: 1,
        name: 'Test',
        email: 'test@example.com',
      }
      axiosMock.onGet('/api/user').reply(200, user)

      await authStore.actions.currentUser({ commit })

      expect(commit).toHaveBeenCalledWith('setApiStatus', true)
      expect(commit).toHaveBeenCalledWith('setUser', user)
    })

    it('should handle server error', async () => {
      const commit = jest.fn()
      axiosMock.onGet('/api/user').reply(500)

      await authStore.actions.currentUser({ commit })

      expect(commit).toHaveBeenCalledWith('setApiStatus', false)
      expect(commit).toHaveBeenCalledWith('error/setCode', 500, { root: true })
    })

    it('should handle network error', async () => {
      const commit = jest.fn()
      axiosMock.onGet('/api/user').networkError()

      await authStore.actions.currentUser({ commit })

      expect(commit).toHaveBeenCalledWith('setApiStatus', false)
      expect(commit).toHaveBeenCalledWith('error/setCode', 0, { root: true })
    })

    it('should handle timeout error', async () => {
      const commit = jest.fn()
      axiosMock.onGet('/api/user').timeout()

      await authStore.actions.currentUser({ commit })

      expect(commit).toHaveBeenCalledWith('setApiStatus', false)
      expect(commit).toHaveBeenCalledWith('error/setCode', 0, { root: true })
    })
  })
})
