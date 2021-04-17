import AxiosMock from 'axios-mock-adapter'
import client from '../../../client'
import productStore from '../../../store/product'

const axiosMock = new AxiosMock(client)

describe('product store', () => {
  describe('fetchProducts', () => {
    afterEach(() => {
      axiosMock.resetHistory()
    })

    it('should fetch products from API', async () => {
      const commit = jest.fn()
      const rootGetters = {
        'product/filter/tags': [],
        'product/sort/sort': 'created_at',
        'product/sort/order': 'desc',
      }
      const response = {
        meta: {
          current_page: 1,
          last_page: 3,
        },
        data: [
          {
            id: 1,
            name: 'Apple'
          },
          {
            id: 2,
            name: 'Banana'
          },
          {
            id: 3,
            name: 'Orange'
          },
        ],
      }
      axiosMock.onGet('/api/products').reply(200, response)

      await productStore.actions.fetchProducts({ commit, rootGetters })

      expect(axiosMock.history.get.length).toBe(1)
      expect(axiosMock.history.get[0].params).toEqual({
        tags: [],
        sort: 'created_at',
        order: 'desc',
        page: 1,
      })
      expect(commit).toHaveBeenCalledWith('setProducts', response.data)
      expect(commit).toHaveBeenCalledWith(
        'product/pagination/setCurrentPage',
        response.meta.current_page,
        { root: true },
      )
      expect(commit).toHaveBeenCalledWith(
        'product/pagination/setLastPage',
        response.meta.last_page,
        { root: true },
      )
    })

    it('should handle server error', async () => {
      const commit = jest.fn()
      const rootGetters = {
        'product/filter/tags': [],
        'product/sort/sort': 'created_at',
        'product/sort/order': 'desc',
      }
      axiosMock.onGet('/api/products').reply(500)

      await productStore.actions.fetchProducts({ commit, rootGetters })

      expect(commit).toHaveBeenCalledWith('error/setCode', 500, { root: true })
    })

    it('should handle network error', async () => {
      const commit = jest.fn()
      const rootGetters = {
        'product/filter/tags': [],
        'product/sort/sort': 'created_at',
        'product/sort/order': 'desc',
      }
      axiosMock.onGet('/api/products').networkError()

      await productStore.actions.fetchProducts({ commit, rootGetters })

      expect(commit).toHaveBeenCalledWith('error/setCode', 0, { root: true })
    })

    it('should handle timeout', async () => {
      const commit = jest.fn()
      const rootGetters = {
        'product/filter/tags': [],
        'product/sort/sort': 'created_at',
        'product/sort/order': 'desc',
      }
      axiosMock.onGet('/api/products').timeout()

      await productStore.actions.fetchProducts({ commit, rootGetters })

      expect(commit).toHaveBeenCalledWith('error/setCode', 0, { root: true })
    })
  })
})
