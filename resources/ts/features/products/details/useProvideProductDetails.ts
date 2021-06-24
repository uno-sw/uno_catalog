import { useState } from 'react'

import { ProductDetails } from '../productEntity'
import client from '../../../client'
import { APIError, NetworkError, ValidationError } from '../../../errors'
import { CREATED, OK, UNPROCESSABLE_ENTITY } from '../../../util'

export interface UseProductDetails {
  productDetails: ProductDetails | null
  fetchProductDetails: () => Promise<void>
  updateProductDetails: (payload: UpdatePayload) => Promise<void>
  addProductLink: (title: string, url: string) => Promise<void>
  removeProductLink: (linkId: number) => Promise<void>
}

interface UpdatePayload {
  name?: string
  price?: number | null
  note?: string | null
  tags?: string[]
}

export const useProvideProductDetails = (id: string): UseProductDetails => {
  const [productDetails, setProductDetails] =
    useState<ProductDetails | null>(null)

  const fetchProductDetails = async () => {
    const wait = new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    const request = client.get(`/api/products/${id}`)
    const [_, response] = await Promise.all([wait, request])

    if (!response) {
      throw new NetworkError
    }

    if (response.status !== OK) {
      throw new APIError(response.status)
    }

    setProductDetails(response.data.data)
  }

  const updateProductDetails = async (payload: UpdatePayload) => {
    const wait = new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    const request = client.patch(`/api/products/${id}`, payload)
    const [_, response] = await Promise.all([wait, request])

    if (!response) {
      throw new NetworkError
    }

    if (response.status === UNPROCESSABLE_ENTITY) {
      throw new ValidationError(response.data.errors)
    }

    if (response.status !== OK) {
      throw new APIError(response.status)
    }

    setProductDetails(response.data.data)
  }

  const addProductLink = async (title: string, url: string) => {
    const wait = new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    const request = client.post(`/api/products/${id}/links`, { title, url })
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

    setProductDetails(value =>
      value === null
        ? null
        : {
            ...value,
            links: [...value.links, { id: response.data.id, title, url }]
          },
    )
  }

  const removeProductLink = async (linkId: number) => {
    const response = await client.delete(`/api/links/${linkId}`)

    if (!response) {
      throw new NetworkError
    }

    if (response.status !== OK) {
      throw new APIError(response.status)
    }

    setProductDetails(value =>
      value === null
        ? null
        : {
            ...value,
            links: value.links.filter(link => link.id !== linkId)
          }
    )
  }

  return {
    productDetails,
    fetchProductDetails,
    updateProductDetails,
    addProductLink,
    removeProductLink,
  }
}
