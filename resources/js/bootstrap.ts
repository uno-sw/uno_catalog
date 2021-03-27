import axios, { AxiosStatic } from 'axios';
import { getCookieValue } from './util'

declare global {
  interface Window {
    axios: AxiosStatic
  }
  interface Element {
    content: string
  }
}

export default function bootstrap() {
  window.axios = axios

  window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

  window.axios.interceptors.request.use(config => {
    config.headers['X-XSRF-TOKEN'] = getCookieValue('XSRF-TOKEN')
    return config
  })

  window.axios.interceptors.response.use(
    response => response,
    error => error.response || error
  )
}
