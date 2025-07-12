import { http } from "@/lib/http"
import type { Result, Profile } from "@/lib/types/user"

// 用户相关 API
export const userApi = {
  // 获取当前用户信息
  getCurrentUser: async (): Promise<Result<Profile>> => {
    const response = await http.get<Result<Profile>>("/api/user/profile")
    return response.data
  },

  // 登录
  login: async (username: string, password: string): Promise<Result<Profile>> => {
    const response = await http.post<Result<Profile>>("/api/auth/login", {
      username,
      password,
    })
    return response.data
  },

  // 登出
  logout: async (): Promise<Result<null>> => {
    const response = await http.post<Result<null>>("/api/auth/logout")
    return response.data
  },
}

// 业务配置相关 API
export const bizConfigApi = {
  // 获取业务配置列表
  getList: async (): Promise<Result<any[]>> => {
    const response = await http.get<Result<any[]>>("/api/biz-config")
    return response.data
  },

  // 获取单个业务配置
  getById: async (id: string): Promise<Result<any>> => {
    const response = await http.get<Result<any>>(`/api/biz-config/${id}`)
    return response.data
  },

  // 创建业务配置
  create: async (data: any): Promise<Result<any>> => {
    const response = await http.post<Result<any>>("/api/biz-config", data)
    return response.data
  },

  // 更新业务配置
  update: async (id: string, data: any): Promise<Result<any>> => {
    const response = await http.put<Result<any>>(`/api/biz-config/${id}`, data)
    return response.data
  },

  // 删除业务配置
  delete: async (id: string): Promise<Result<null>> => {
    const response = await http.delete<Result<null>>(`/api/biz-config/${id}`)
    return response.data
  },
}

// 提示词相关 API
export const promptApi = {
  // 获取提示词列表
  getList: async (): Promise<Result<any[]>> => {
    const response = await http.get<Result<any[]>>("/api/prompts")
    return response.data
  },

  // 获取单个提示词
  getById: async (id: string): Promise<Result<any>> => {
    const response = await http.get<Result<any>>(`/api/prompts/${id}`)
    return response.data
  },

  // 创建提示词
  create: async (data: any): Promise<Result<any>> => {
    const response = await http.post<Result<any>>("/api/prompts", data)
    return response.data
  },

  // 更新提示词
  update: async (id: string, data: any): Promise<Result<any>> => {
    const response = await http.put<Result<any>>(`/api/prompts/${id}`, data)
    return response.data
  },

  // 删除提示词
  delete: async (id: string): Promise<Result<null>> => {
    const response = await http.delete<Result<null>>(`/api/prompts/${id}`)
    return response.data
  },

  // 获取提示词版本列表
  getVersions: async (promptId: string): Promise<Result<any[]>> => {
    const response = await http.get<Result<any[]>>(`/api/prompts/${promptId}/versions`)
    return response.data
  },

  // 获取单个版本
  getVersionById: async (promptId: string, versionId: string): Promise<Result<any>> => {
    const response = await http.get<Result<any>>(`/api/prompts/${promptId}/versions/${versionId}`)
    return response.data
  },

  // 创建新版本
  createVersion: async (promptId: string, data: any): Promise<Result<any>> => {
    const response = await http.post<Result<any>>(`/api/prompts/${promptId}/versions`, data)
    return response.data
  },

  // 更新版本
  updateVersion: async (promptId: string, versionId: string, data: any): Promise<Result<any>> => {
    const response = await http.put<Result<any>>(`/api/prompts/${promptId}/versions/${versionId}`, data)
    return response.data
  },

  // 删除版本
  deleteVersion: async (promptId: string, versionId: string): Promise<Result<null>> => {
    const response = await http.delete<Result<null>>(`/api/prompts/${promptId}/versions/${versionId}`)
    return response.data
  },
}
