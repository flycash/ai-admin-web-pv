// 用户相关类型定义

export interface Profile {
  id: string
  username: string
  email: string
  avatar?: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  code: number
  message: string
  data: {
    profile: Profile
    token: string
  }
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}
