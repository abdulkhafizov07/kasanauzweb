import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios'

interface Tokens {
  accessToken: string | null
  refreshToken: string | null
}

interface RefreshResponse {
  access: string
  refresh: string
}

const getTokens = (): Tokens => ({
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
})

const setAccessToken = (token: string) => {
  localStorage.setItem('accessToken', token)
}

const deleteAccessToken = (refresh: boolean = false) => {
  localStorage.removeItem('accessToken')
  if (refresh) {
    localStorage.removeItem('refreshToken')
  }
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 30000,
  withCredentials: true,
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = getTokens()
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
          }
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const { refreshToken } = getTokens()

      if (!refreshToken) {
        return Promise.reject(error)
      }

      try {
        const response = await axios.post<RefreshResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/users/api/auth/refresh/`,
          { refresh: refreshToken },
        )

        if (response.status == 200) {
          const newAccessToken = response.data.access
          setAccessToken(newAccessToken)
          localStorage.setItem('refreshToken', response.data.refresh)

          new Promise((resolve) => setTimeout(resolve, 500))

          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] =
              `Bearer ${newAccessToken}`
          }
          api.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`
          processQueue(null, newAccessToken)

          return api(originalRequest)
        } else {
          deleteAccessToken(true)
        }
      } catch (err) {
        processQueue(err, null)
        deleteAccessToken(true)
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default api
