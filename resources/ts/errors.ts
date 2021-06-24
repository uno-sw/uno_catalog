export class NetworkError {}

export class APIError {
  readonly code: number

  constructor(code: number) {
    this.code = code
  }
}

export class ValidationError {
  readonly messages: any

  constructor(messages: any) {
    this.messages = messages
  }
}
