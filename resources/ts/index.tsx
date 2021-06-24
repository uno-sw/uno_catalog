import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { SnackbarProvider } from 'notistack'

import { App } from './App'
import { AuthProvider } from './features/auth/useAuth'
import { ProductsProvider } from './features/products/index/useProducts'

ReactDOM.render(
  <SnackbarProvider>
    <AuthProvider>
      <ProductsProvider>
        <CssBaseline />
        <App />
      </ProductsProvider>
    </AuthProvider>
  </SnackbarProvider>,
  document.getElementById('app')
)
