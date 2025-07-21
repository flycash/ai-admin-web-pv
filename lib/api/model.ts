import { apiRequest } from "./types"

export interface ModelInfo {
  id: string
  name: string
  provider: string
  description?: string
}

export const modelApi = {
  // 获取模型列表
  getList: () => {
    return apiRequest.get<ModelInfo[]>("/models")
  },

  // 根据ID获取模型信息
  getById: (id: string) => {
    return apiRequest.get<ModelInfo>(`/models/${id}`)
  },
}
