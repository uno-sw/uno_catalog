import { beforeEach } from '../router'
import store from '../store'

jest.mock('../store', () => ({ commit: jest.fn() }))

describe('router', () => {
  afterEach(() => {
    store.commit.mockClear()
  })

  describe('auth guard', () => {
    it('should redirect to /login when not authenticated', () => {
      const to = {
        matched: [{ meta: { auth: true } }],
      }
      const next = jest.fn()
      store.getters = { 'auth/check': false }

      beforeEach(to, undefined, next)

      expect(store.commit).toHaveBeenCalledWith('auth/setForwardingRoute', to)
      expect(next).toHaveBeenCalledWith('/login')
    })

    it('should not redirect when authenticated', () => {
      const to = {
        matched: [{ meta: { auth: true } }],
      }
      const next = jest.fn()
      store.getters = { 'auth/check': true }

      beforeEach(to, undefined, next)

      expect(next).toHaveBeenCalledWith()
    })
  })

  describe('guest guard', () => {
    it('should redirect to / when authenticated', () => {
      const to = {
        matched: [{ meta: { guest: true } }],
      }
      const next = jest.fn()
      store.getters = { 'auth/check': true }

      beforeEach(to, undefined, next)

      expect(next).toHaveBeenCalledWith('/')
    })

    it('should not redirect when not authenticated', () => {
      const to = {
        matched: [{ meta: { guest: true } }],
      }
      const next = jest.fn()
      store.getters = { 'auth/check': false }

      beforeEach(to, undefined, next)

      expect(next).toHaveBeenCalledWith()
    })
  })
})
