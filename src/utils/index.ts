import Taro from '@tarojs/taro'

/**
 * 路由跳转
 */
export const navigateTo = (url: string) => Taro.navigateTo({ url })
export const redirectTo = (url: string) => Taro.redirectTo({ url })
export const switchTab = (url: string) => Taro.switchTab({ url })
export const navigateBack = (delta = 1) => Taro.navigateBack({ delta })

/**
 * 提示工具
 */
export const showToast = (title: string, icon: 'success' | 'error' | 'loading' | 'none' = 'none') =>
  Taro.showToast({ title, icon, duration: 2000 })

export const showLoading = (title = '加载中...') =>
  Taro.showLoading({ title, mask: true })

export const hideLoading = () => Taro.hideLoading()

/**
 * 格式化日期
 */
export const formatDate = (date: Date | string | number, fmt = 'YYYY-MM-DD') => {
  const d = new Date(date)
  const map: Record<string, string> = {
    YYYY: String(d.getFullYear()),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    DD: String(d.getDate()).padStart(2, '0'),
    HH: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
  }
  return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, (key) => map[key])
}

/**
 * 手机号脱敏
 */
export const maskPhone = (phone: string) =>
  phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
