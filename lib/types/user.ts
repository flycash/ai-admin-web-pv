// 用户信息
import {Result} from "@/lib/types/result";

export interface Profile {
  id: number
  avatar: string
  nickname: string
}

// 登录响应
export type LoginResponse = Result<Profile>
