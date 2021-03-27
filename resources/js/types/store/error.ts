export interface ErrorState {
  code: number | null
  message: string
}

export interface ErrorGetters {
  code: number | null
  message: string
}

export interface ErrorMutations {
  setCode: number | null
  setMessage: string
}
