import axios, { AxiosError } from 'axios'

export const http = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export function isCanceled(e: unknown) {
  return axios.isCancel(e) || (e instanceof AxiosError && e.name === 'CanceledError')
}

http.interceptors.response.use(
  r => r,
  (error) => {
    if (error instanceof AxiosError) {
      if (axios.isCancel(error)) {
        return Promise.reject(error)
      }
      const status = error?.response?.status
      if (status === 404) {
        error.message = '404 Не найдено'
      }
      else {
        error.message = 'Неизвестная ошибка'
      }
      return Promise.reject(error)
    }
    return Promise.reject(error)
  },
)
