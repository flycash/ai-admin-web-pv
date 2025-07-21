import { apiRequest, type PaginatedResponse, type PaginationParams } from "./types"
import type { ConfigVersion, CreateConfigVersionRequest, UpdateConfigVersionRequest } from "@/lib/types/llm_invocation"

export const configVersionApi = {
  // 获取配置版本列表
  getList: (configId: string, params?: PaginationParams) => {
    return apiRequest.get<PaginatedResponse<ConfigVersion>>(`/invocation_config/${configId}/versions`, params)
  },

  // 根据ID获取配置版本
  getById: (configId: string, versionId: string) => {
    return apiRequest.get<ConfigVersion>(`/invocation_config/${configId}/versions/${versionId}`)
  },

  // 创建配置版本
  create: (configId: string, data: CreateConfigVersionRequest) => {
    return apiRequest.post<ConfigVersion>(`/invocation_config/${configId}/versions`, data)
  },

  // 更新配置版本
  update: (configId: string, versionId: string, data: UpdateConfigVersionRequest) => {
    return apiRequest.put<ConfigVersion>(`/invocation_config/${configId}/versions/${versionId}`, data)
  },

  // 删除配置版本
  delete: (configId: string, versionId: string) => {
    return apiRequest.delete<void>(`/invocation_config/${configId}/versions/${versionId}`)
  },

  // 切换版本状态
  toggleStatus: (configId: string, versionId: string) => {
    return apiRequest.post<ConfigVersion>(`/invocation_config/${configId}/versions/${versionId}/toggle-status`)
  },
}
