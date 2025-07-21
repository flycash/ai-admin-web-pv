// 通用响应格式
export interface Result<T> {
  code: number
  msg: string
  data: T
}

export interface DataList<T> {
  list: T[]
  total: number
}
