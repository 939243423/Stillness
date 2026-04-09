import { create } from 'zustand'
import Taro from '@tarojs/taro'

interface UserInfo {
  id: number
  nickName: string
  avatarUrl: string
  phone: string
}

interface UserState {
  token: string
  userInfo: UserInfo | null
  isLogin: boolean
  setToken: (token: string) => void
  setUserInfo: (info: UserInfo) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  token: Taro.getStorageSync('token') || '',
  userInfo: null,
  isLogin: !!Taro.getStorageSync('token'),

  setToken: (token) => {
    Taro.setStorageSync('token', token)
    set({ token, isLogin: true })
  },

  setUserInfo: (userInfo) => {
    set({ userInfo })
  },

  logout: () => {
    Taro.removeStorageSync('token')
    set({ token: '', userInfo: null, isLogin: false })
  },
}))
