import type { AxiosRequestConfig, AxiosResponse } from 'axios'

interface ApiRequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (err: any) => any
  // 全局interceptor會將data從response的中取出，會導致response的類型改變，所以用泛型
  responseInterceptor?: (res: T) => T
  responseInterceptorCatch?: (err: any) => any
}

interface ApiRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  showLoading?: boolean
  interceptors?: ApiRequestInterceptors<T>
}

export { ApiRequestInterceptors, ApiRequestConfig }
