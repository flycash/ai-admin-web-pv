export interface InvocationConfig {
  // 业务配置 ID
  bizID: number
  name: string
  description: string
  versions: ConfigVersion[]
  // 创建时间，毫秒数
  ctime: number
  // 更新时间，毫秒数
  utime: number
  // 当前保持活跃的 PromptVersion 的 id
  activeVersion: number
}

// 调用大模型的配置的版本
export interface ConfigVersion {
  id: number
  // InvocationConfig 的ID
  invID: number
  version: string
  // Prompt 内容
  content: string
  // 系统提示词
  systemPrompt: string
  // 使用的大模型的 ID
  modelID: number
  // 大模型调用中的 top N 参数
  topN: number
  // 大模型调用中的 最大 token 数量
  maxTokens: number
  // 大模型调用中的 temperature 参数
  temperature: number
}
