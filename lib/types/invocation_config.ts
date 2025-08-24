import * as var_module_app from "VAR_MODULE_APP";

export interface InvocationConfig {
  // 调用配置的 ID
  id: number
  // 业务配置 ID
  bizID: number
  bizName: string

  name: string
  description: string
  versions: ConfigVersion[]
  // 创建时间，毫秒数
  ctime: number
  // 更新时间，毫秒数
  utime: number
}

export interface Function {
  name: string
  // 还是一个 JSON
  definition: string
}

// 调用大模型的配置的版本
export interface ConfigVersion {
  id: number
  // InvocationConfig 的ID
  invID: number
  version: string
  // Prompt 内容
  prompt: string
  // 系统提示词
  systemPrompt: string
  // 使用的大模型的 ID
  modelID: number
  modelName: string
  modelProviderID: number
  modelProviderName: string
  // 大模型调用中的 top P 参数
  topP: number
  // 大模型调用中的 最大 token 数量
  maxTokens: number
  // 大模型调用中的 temperature 参数
  temperature: number
  // 创建时间，毫秒数
  ctime: number
  // ACTIVE 或者 INACTIVE
  status: string
  // 更新时间，毫秒数
  utime: number

  // 大模型使用的 JSON schema 的定义
  jsonSchema: string
  // 部分调用要使用的一些特定的属性，也是一个 JSON
  attributes: string
  functions: Function[]
}
