import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import { useAuth } from '../../features/auth/useAuth'

export const AuthRoute: React.VFC<RouteProps> = ({ children, ...rest }) => {
  const { user } = useAuth()

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user
          ? children
          : <Redirect
              to={{ pathname: '/login', state: { from: location } }}
            />
      }
    ></Route>
  )
}
