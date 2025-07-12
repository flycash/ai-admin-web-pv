export interface Result<T> {
  code: number
  msg: string
  data: T
}

export interface Profile {
  id: number
  avatar: string
  nickname: string
}

export type LoginResponse = Result<Profile>
