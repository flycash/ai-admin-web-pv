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
  // 多少元/一百万 token
  inputPrice: number
  // 多少元/一百万 token
  outputPrice: number
}
