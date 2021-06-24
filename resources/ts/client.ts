import axios from 'axios'
import { getCookieValue } from './util'

const client = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

client.interceptors.request.use(config => {
  config.headers['X-XSRF-TOKEN'] = getCookieValue('XSRF-TOKEN')
  return config
})

client.interceptors.response.use(
  response => response,
  error => error.response
)

export default client
