import { apiRequest, type PaginatedResponse, type PaginationParams } from "./types"
import type { BizConfig, CreateBizConfigRequest, UpdateBizConfigRequest } from "@/lib/types/biz_config"

export const bizConfigApi = {
  // 获取业务配置列表
  getList: (params?: PaginationParams) => {
    return apiRequest.get<PaginatedResponse<BizConfig>>("/biz_config", params)
  },

  // 获取所有业务配置（不分页）
  getAll: () => {
    return apiRequest.get<BizConfig[]>("/biz_config/all")
  },

  // 根据ID获取业务配置
  getById: (id: string) => {
    return apiRequest.get<BizConfig>(`/biz_config/${id}`)
  },

  // 创建业务配置
  create: (data: CreateBizConfigRequest) => {
    return apiRequest.post<BizConfig>("/biz_config", data)
  },

  // 更新业务配置
  update: (id: string, data: UpdateBizConfigRequest) => {
    return apiRequest.put<BizConfig>(`/biz_config/${id}`, data)
  },

  // 删除业务配置
  delete: (id: string) => {
    return apiRequest.delete<void>(`/biz_config/${id}`)
  },
}
