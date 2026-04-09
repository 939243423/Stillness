import Taro from '@tarojs/taro'

// 读取环境变量，按 env 切换
const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'https://dev-api.example.com'
  : 'https://api.example.com'

// 请求超时时间（ms）
const TIMEOUT = 10000

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: Record<string, any>
  header?: Record<string, string>
}

interface ResponseData<T = any> {
  code: number
  message: string
  data: T
}

/**
 * 统一请求封装
 */
function request<T = any>(options: RequestOptions): Promise<T> {
  const token = Taro.getStorageSync('token') || ''

  return new Promise((resolve, reject) => {
    Taro.request({
      url: `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      timeout: TIMEOUT,
      header: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...options.header,
      },
      success(res) {
        const result = res.data as ResponseData<T>
        if (res.statusCode === 200 && result.code === 0) {
          resolve(result.data)
        } else if (res.statusCode === 401) {
          // token 过期，跳转登录
          Taro.reLaunch({ url: '/pages/login/index' })
          reject(new Error('未登录或登录已过期'))
        } else {
          Taro.showToast({ title: result.message || '请求失败', icon: 'none' })
          reject(new Error(result.message))
        }
      },
      fail(err) {
        Taro.showToast({ title: '网络异常，请稍后重试', icon: 'none' })
        reject(err)
      },
    })
  })
}

export const http = {
  get<T = any>(url: string, data?: Record<string, any>) {
    return request<T>({ url, method: 'GET', data })
  },
  post<T = any>(url: string, data?: Record<string, any>) {
    return request<T>({ url, method: 'POST', data })
  },
  put<T = any>(url: string, data?: Record<string, any>) {
    return request<T>({ url, method: 'PUT', data })
  },
  delete<T = any>(url: string, data?: Record<string, any>) {
    return request<T>({ url, method: 'DELETE', data })
  },
}
