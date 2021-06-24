import { useState } from 'react'
import client from '../../client'
import { APIError, NetworkError, ValidationError } from '../../errors'
import { OK, UNPROCESSABLE_ENTITY } from '../../util'

export interface User {
  id: number
  email: string
  name: string
}

export interface UseAuth {
  user: User | null
  login: (email: string, password: string, remember: boolean) => Promise<User>
  logout: () => Promise<void>
  fetchCurrentUser: () => Promise<User | null>
}

export const useProvideAuth = (): UseAuth => {
  const [user, setUser] = useState<User | null>(null)

  const login = async (
    email: string,
    password: string,
    remember: boolean
  ): Promise<User> => {
    await client.get('/sanctum/csrf-cookie')

    const wait = new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    const login = client.post('/api/login', { email, password, remember })
    const [, response] = await Promise.all([wait, login])

    if (!response) {
      throw new NetworkError
    }

    if (response.status === UNPROCESSABLE_ENTITY) {
      throw new ValidationError(response.data.errors)
    }

    if (response.status !== OK) {
      throw new APIError(response.status)
    }

    const user = {
      id: response.data.id,
      email: response.data.email,
      name: response.data.name,
    }
    setUser(user)
    return user
  }

  const logout = async (): Promise<void> => {
    const response = await client.post('/api/logout')

    if (!response) {
      throw new NetworkError
    }

    if (response.status !== OK) {
      throw new APIError(response.status)
    }

    setUser(null)
  }

  const fetchCurrentUser = async (): Promise<User | null> => {
    const response = await client.get('/api/user')

    if (!response) {
      throw new NetworkError
    }

    if (response.status !== OK) {
      throw new APIError(response.status)
    }

    const user = response.data
      ? {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
        }
      : null
    setUser(user)
    return user
  }

  return { user, login, logout, fetchCurrentUser }
}
