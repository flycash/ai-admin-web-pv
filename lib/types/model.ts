// 大模型服务商
export interface ModelProvider {
  id: number
  name: string
  apiKey: string
  models: Model[]
}

// 大模型
export interface Model {
  id: number
  // Provider 的 ID
  pid: number
  name: string
}
