import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import { useAuth } from '../../features/auth/useAuth'

export const GuestRoute: React.VFC<RouteProps> = (props) => {
  const { user } = useAuth()

  if (user) {
    return <Redirect to="/" />
  } else {
    return <Route {...props} />
  }
}
