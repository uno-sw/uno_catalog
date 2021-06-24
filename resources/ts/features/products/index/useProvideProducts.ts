import { useState } from 'react'

import { ProductSummary } from '../productEntity'
import client from '../../../client'
import { APIError, NetworkError, ValidationError } from '../../../errors'
import { CREATED, OK, UNPROCESSABLE_ENTITY } from '../../../util'

export const sortOptions = ['created_at', 'updated_at', 'name', 'price'] as const
export const orderOptions = ['asc', 'desc'] as const

export type SortOption = typeof sortOptions[number]
export type OrderOption = typeof orderOptions[number]

export interface ProductIndexParams {
  tags?: number[]
  sort?: SortOption
  order?: OrderOption
}

export interface UseProducts {
  products: ProductSummary[]
  currentPage: number
  lastPage: number
  canLoadMore: boolean
  fetchProducts: (params?: ProductIndexParams) => Promise<void>
  fetchMoreProducts: (params?: ProductIndexParams) => Promise<void>
  registerProduct: (name: string) => Promise<number>
}

export const useProvideProducts = (): UseProducts => {
  const [products, setProducts] = useState<ProductSummary[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [lastPage, setLastPage] = useState<number>(0)

  const canLoadMore = currentPage < lastPage

  const fetchProducts = async (params?: ProductIndexParams) => {
    const wait = new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    const request = client.get('/api/products', { params })
    const [_, response] = await Promise.all([wait, request])

    if (!response) {
      throw new NetworkError
    }

    if (response.status !== OK) {
      throw new APIError(response.status)
    }

    setProducts(response.data.data)
    setCurrentPage(response.data.meta.current_page)
    setLastPage(response.data.meta.last_page)
  }

  const fetchMoreProducts = async (params?: ProductIndexParams) => {
    if (!canLoadMore) {
      return
    }

    const wait = new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    const request = client.get(
      '/api/products',
      {
        params: {
          ...params,
          page: currentPage + 1,
        },
      },
    )
    const [_, response] = await Promise.all([wait, request])

    if (!response) {
      throw new NetworkError
    }

    if (response.status !== OK) {
      throw new APIError(response.status)
    }

    setProducts(currentProducts => [...currentProducts, ...response.data.data])
    setCurrentPage(response.data.meta.current_page)
    setLastPage(response.data.meta.last_page)
  }

  const registerProduct = async (name: string): Promise<number> => {
    const wait = new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    const request = client.post('/api/products', { name })
    const [_, response] = await Promise.all([wait, request])

    if (!response) {
      throw new NetworkError
    }

    if (response.status === UNPROCESSABLE_ENTITY) {
      throw new ValidationError(response.data.errors)
    }

    if (response.status !== CREATED) {
      throw new APIError(response.status)
    }

    return response.data.id
  }

  return {
    products,
    currentPage,
    lastPage,
    canLoadMore,
    fetchProducts,
    fetchMoreProducts,
    registerProduct,
  }
}
