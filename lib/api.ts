import type { Result } from "@/lib/types/user"

// 基础 API 配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9002"

// 通用请求函数
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<Result<T>> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// 提示词相关 API
export const promptApi = {
  // 获取提示词列表
  list: () => apiRequest<PromptVO[]>("/prompt"),

  // 获取单个提示词详情
  get: (id: number) => apiRequest<PromptVO>(`/prompt/${id}`),

  // 创建提示词
  create: (data: CreatePromptRequest) =>
    apiRequest<PromptVO>("/prompt/add", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 更新提示词版本
  updateVersion: (data: UpdatePromptVersionRequest) =>
    apiRequest<null>("/prompt/update/version", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 删除提示词
  delete: (id: number) =>
    apiRequest<null>(`/prompt/${id}`, {
      method: "DELETE",
    }),

  // 激活版本
  activateVersion: (promptId: number, versionId: number) =>
    apiRequest<null>("/prompt/activate", {
      method: "POST",
      body: JSON.stringify({ promptId, versionId }),
    }),

  // 发布版本
  publishVersion: (versionId: number) =>
    apiRequest<null>("/prompt/publish", {
      method: "POST",
      body: JSON.stringify({ versionId }),
    }),

  // 分支版本
  forkVersion: (versionId: number) =>
    apiRequest<PromptVersionVO>("/prompt/fork", {
      method: "POST",
      body: JSON.stringify({ versionId }),
    }),
}

// 业务配置相关 API
export const bizConfigApi = {
  // 获取业务配置列表
  list: () => apiRequest<BizConfigVO[]>("/biz_config"),

  // 获取单个业务配置详情
  get: (id: number) => apiRequest<BizConfigVO>(`/biz_config/${id}`),

  // 创建业务配置
  create: (data: CreateBizConfigRequest) =>
    apiRequest<BizConfigVO>("/biz_config", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 更新业务配置
  update: (id: number, data: UpdateBizConfigRequest) =>
    apiRequest<BizConfigVO>(`/biz_config/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // 删除业务配置
  delete: (id: number) =>
    apiRequest<null>(`/biz_config/${id}`, {
      method: "DELETE",
    }),
}

// 类型定义
export interface PromptVO {
  id: number
  name: string
  owner: number
  owner_type: "user" | "organization"
  active_version: number
  description: string
  versions: PromptVersionVO[]
  create_time: number
  update_time: number
}

export interface PromptVersionVO {
  id: number
  label: string
  content: string
  system_content: string
  temperature: number
  top_n: number
  max_tokens: number
  status: number // 0: 草稿, 1: 已发布
  ctime: number
  utime: number
}

export interface BizConfigVO {
  id: number
  name: string
  ownerID: number
  ownerType: "user" | "organization"
  config: string
  createTime: number
  updateTime: number
}

export interface CreatePromptRequest {
  label: string
  content: string
  system_content: string
  temperature: number
  top_n: number
  max_tokens: number
  status: number
  biz_config_id: number
}

export interface UpdatePromptVersionRequest {
  id: number
  label: string
  content: string
  system_content: string
  temperature: number
  top_n: number
  max_tokens: number
  status: number
}

export interface CreateBizConfigRequest {
  name: string
  ownerID: number
  ownerType: "user" | "organization"
  config: string
}

export interface UpdateBizConfigRequest {
  name: string
  config: string
}
