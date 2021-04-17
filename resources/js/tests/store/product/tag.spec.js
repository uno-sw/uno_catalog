import AxiosMock from 'axios-mock-adapter'
import client from '../../../client'
import tagStore from '../../../store/product/tag'

const axiosMock = new AxiosMock(client)

describe('product tag store', () => {
  describe('fetchTags', () => {
    it('should fetch tags from API', async () => {
      const commit = jest.fn()
      const tags = [
        {
          id: 1,
          label: 'Apple',
        },
        {
          id: 2,
          label: 'Banana',
        },
        {
          id: 3,
          label: 'Orange',
        },
      ]
      axiosMock.onGet('/api/tags').reply(200, { data: tags })

      await tagStore.actions.fetchTags({ commit })

      expect(commit).toHaveBeenCalledWith('setTags', tags)
    })

    it('should handle server error', async () => {
      const commit = jest.fn()
      axiosMock.onGet('/api/tags').reply(500)

      await tagStore.actions.fetchTags({ commit })

      expect(commit).toHaveBeenCalledWith('error/setCode', 500, { root: true })
    })

    it('should handle network error', async () => {
      const commit = jest.fn()
      axiosMock.onGet('/api/tags').networkError()

      await tagStore.actions.fetchTags({ commit })

      expect(commit).toHaveBeenCalledWith('error/setCode', 0, { root: true })
    })

    it('should handle timeout', async () => {
      const commit = jest.fn()
      axiosMock.onGet('/api/tags').timeout()

      await tagStore.actions.fetchTags({ commit })

      expect(commit).toHaveBeenCalledWith('error/setCode', 0, { root: true })
    })
  })

  describe('deleteTag', () => {
    it('should request API to delete tag', async () => {
      const commit = jest.fn()
      axiosMock.onDelete('/api/tags/1').reply(200)

      await tagStore.actions.deleteTag({ commit }, 1)

      expect(commit).toHaveBeenCalledWith('setApiStatus', true)
    })

    it('should handle server error', async () => {
      const commit = jest.fn()
      axiosMock.onDelete('/api/tags/1').reply(500)

      await tagStore.actions.deleteTag({ commit }, 1)

      expect(commit).toHaveBeenCalledWith('error/setCode', 500, { root: true })
    })

    it('should handle network error', async () => {
      const commit = jest.fn()
      axiosMock.onDelete('/api/tags/1').networkError()

      await tagStore.actions.deleteTag({ commit }, 1)

      expect(commit).toHaveBeenCalledWith('error/setCode', 0, { root: true })
    })

    it('should handle timeout', async () => {
      const commit = jest.fn()
      axiosMock.onDelete('/api/tags/1').timeout()

      await tagStore.actions.deleteTag({ commit }, 1)

      expect(commit).toHaveBeenCalledWith('error/setCode', 0, { root: true })
    })
  })
})
