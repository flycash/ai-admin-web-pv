// 通用分页响应类型
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 通用分页参数
export interface PaginationParams {
  page?: number
  pageSize?: number
}

// 通用请求工具函数
export const apiRequest = {
  get: <T>(url: string, params?: any): Promise<Result<T>> => {
    return http.get(url, { params })
  },
  \
  post: <T>(url: string, data?: any): Promise<Result<T>> => {
    return http.post(url, data)
  },
  \
  put: <T>(url: string, data?: any): Promise<Result<T>> => {
    return http.put(url, data)
  },
  \
  delete: <T>(url: string): Promise<Result<T>> => {
    return http.delete(url)
  }
}\
