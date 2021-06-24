import React from 'react'
import { useParams } from 'react-router-dom'

import {
  UseProductDetails,
  useProvideProductDetails
} from './useProvideProductDetails'

interface Props {
  children: React.ReactNode
}

const productDetailsContext =
  React.createContext<UseProductDetails | null>(null)

const useProductDetails = (): UseProductDetails => {
  const context = React.useContext(productDetailsContext)
  if (context) {
    return context
  } else {
    throw new Error(
      'useProductDetails must be used within a ProductDetailsProvider'
    )
  }
}

const ProductDetailsProvider: React.VFC<Props> = ({ children }) => {
  const { id } = useParams<{ id: string }>()
  const products = useProvideProductDetails(id)

  return (
    <productDetailsContext.Provider value={products}>
      {children}
    </productDetailsContext.Provider>
  )
}

export { useProductDetails, ProductDetailsProvider }
