import { apiRequest } from "./types"
import type { User, LoginRequest } from "@/lib/types/user"

export const userApi = {
  // 用户登录
  login: (data: LoginRequest) => {
    return apiRequest.post<{ user: User; token: string }>("/auth/login", data)
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    return apiRequest.get<User>("/auth/me")
  },

  // 用户登出
  logout: () => {
    return apiRequest.post<void>("/auth/logout")
  },
}
