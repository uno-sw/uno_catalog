import React from 'react'

import { useProvideAuth, UseAuth } from './useProvideAuth'
import { createGenericContext } from '../../util'

interface Props {
  children: React.ReactNode
}

const [useAuth, AuthContextProvider] = createGenericContext<UseAuth>()

const AuthProvider: React.VFC<Props> = ({ children }) => {
  const auth = useProvideAuth()

  return <AuthContextProvider value={auth}>{children}</AuthContextProvider>
}

export { useAuth, AuthProvider }
