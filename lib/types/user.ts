// 通用响应格式
export interface Result<T> {
  code: number
  msg: string
  data: T
}

// 用户信息
export interface Profile {
  id: number
  avatar: string
  nickname: string
}

// 登录响应
export type LoginResponse = Result<Profile>
