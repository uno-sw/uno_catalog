import React from 'react'

import { UseProducts, useProvideProducts } from './useProvideProducts'
import { createGenericContext } from '../../../util'

interface Props {
  children: React.ReactNode
}

const [useProducts, ProductsContextProvider] =
  createGenericContext<UseProducts>()

const ProductsProvider: React.VFC<Props> = ({ children }) => {
  const products = useProvideProducts()

  return (
    <ProductsContextProvider value={products}>
      {children}
    </ProductsContextProvider>
  )
}

export { useProducts, ProductsProvider }
