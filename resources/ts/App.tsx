import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

import { AuthRoute } from './components/routes/AuthRoute'
import { GuestRoute } from './components/routes/GuestRoute'
import { APIError, NetworkError } from './errors'
import { Login } from './features/auth/Login'
import { useAuth } from './features/auth/useAuth'
import { ProductDetails } from './features/products/details/ProductDetails'
import { ProductDetailsProvider } from './features/products/details/useProductDetails'
import { ProductIndex } from './features/products/index/ProductIndex'
import { EditTags } from './features/tags/EditTags'

export const App: React.VFC = () => {
  const { fetchCurrentUser } = useAuth()
  const [isUserLoaded, setIsUserLoaded] = useState(false)
  const [userLoadError, setUserLoadError] = useState('')

  useEffect(() => {
    let unmounted = false

    const f = async () => {
      try {
        await fetchCurrentUser()
        if (!unmounted) {
          setIsUserLoaded(true)
        }
      } catch (e) {
        if (!unmounted) {
          if (e instanceof NetworkError) {
            setUserLoadError('ネットワークに接続されていません。')
          } else if (e instanceof APIError) {
            setUserLoadError(
              'サーバーエラーが発生しました。時間をおいてもう一度アクセスしてください。'
            )
          }
        }
      }
    }

    f()

    return () => { unmounted = true }
  }, [])

  if (userLoadError) {
    return <p>{userLoadError}</p>
  }

  if (!isUserLoaded) {
    return null
  }

  return (
    <Router>
      <Switch>
        <GuestRoute exact path="/login">
          <Login />
        </GuestRoute>
        <AuthRoute exact path="/">
          <ProductIndex />
        </AuthRoute>
        <AuthRoute exact path="/products/:id">
          <ProductDetailsProvider>
            <ProductDetails />
          </ProductDetailsProvider>
        </AuthRoute>
        <AuthRoute exact path="/tags">
          <EditTags />
        </AuthRoute>
      </Switch>
    </Router>
  )
}
