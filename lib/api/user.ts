import { apiRequest } from "./types"
import type { Profile } from "@/lib/types/user"

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: Profile
}

export const userApi = {
  // 用户登录
  login: (data: LoginRequest) => {
    return apiRequest.post<LoginResponse>("/auth/login", data)
  },

  // 获取用户信息
  getUserInfo: () => {
    return apiRequest.get<Profile>("/auth/me")
  },

  // 用户登出
  logout: () => {
    return apiRequest.post<void>("/auth/logout")
  },
}
