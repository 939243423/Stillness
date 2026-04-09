import { http } from './request'

// ============ 示例：用户相关接口 ============
export interface UserInfo {
  id: number
  nickName: string
  avatarUrl: string
  phone: string
}

export const userApi = {
  /** 获取用户信息 */
  getUserInfo: () => http.get<UserInfo>('/user/info'),
  /** 微信登录 */
  wxLogin: (code: string) =>
    http.post<{ token: string; userInfo: UserInfo }>('/auth/wx-login', { code }),
}
