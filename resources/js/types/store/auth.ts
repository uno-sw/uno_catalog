export interface User {
  id: number,
  email: string,
  name: string,
}

export interface AuthState {
  user: User | null
  apiStatus: boolean | null
  loginErrorMessages: string[] | null
  forwardingRoute: string | null
  isProcessing: boolean
}

export interface AuthGetters {
  check: boolean
  username: string
  apiStatus: boolean | null
  loginErrorMessages: string[] | null
  forwardingRoute: string | null
  isProcessing: boolean
}

export interface AuthMutations {
  setUser: User | null
  setApiStatus: boolean | null
  setLoginErrorMessages: string[] | null
  setForwardingRoute: string | null
  setIsProcessing: boolean
}

export interface AuthActions {
  login: {
    email: string
    password: string
  }
  logout: void
  currentUser: void
}
