import { apiRequest, type PaginatedResponse, type PaginationParams } from "./types"
import type {
  InvocationConfig,
  CreateInvocationConfigRequest,
  UpdateInvocationConfigRequest,
} from "@/lib/types/llm_invocation"

export const invocationConfigApi = {
  // 获取调用配置列表（分页）
  getList: (params?: PaginationParams) => {
    return apiRequest.get<PaginatedResponse<InvocationConfig>>("/invocation_config", params)
  },

  // 根据ID获取调用配置
  getById: (id: string) => {
    return apiRequest.get<InvocationConfig>(`/invocation_config/${id}`)
  },

  // 创建调用配置
  create: (data: CreateInvocationConfigRequest) => {
    return apiRequest.post<InvocationConfig>("/invocation_config", data)
  },

  // 更新调用配置
  update: (id: string, data: UpdateInvocationConfigRequest) => {
    return apiRequest.put<InvocationConfig>(`/invocation_config/${id}`, data)
  },

  // 删除调用配置
  delete: (id: string) => {
    return apiRequest.delete<void>(`/invocation_config/${id}`)
  },
}
