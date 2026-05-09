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
  /** 模拟扫码成功（通知服务器已扫码） */
  pcLoginScan: (uuid: string) =>
    http.post('/auth/pc-login-scan', { uuid }),
  /** 确认 PC 端扫码登录 */
  confirmPCLogin: (code: string, uuid: string) =>
    http.post('/auth/pc-login-confirm', { code, uuid }),
}
