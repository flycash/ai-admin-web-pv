import { apiRequest } from "./types"

export interface Model {
  id: string
  name: string
  provider: string
  description?: string
}

export const modelApi = {
  // 获取模型列表
  getList: () => {
    return apiRequest.get<Model[]>("/models")
  },

  // 根据提供商获取模型列表
  getByProvider: (provider: string) => {
    return apiRequest.get<Model[]>(`/models/provider/${provider}`)
  },
}
