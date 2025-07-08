// Type definitions matching backend structures

export interface PromptVersionVO {
  id: number
  label: string
  content: string
  system_content: string
  temperature: number
  top_n: number
  max_tokens: number
  status: number
  ctime: number
  utime: number
}

export interface PromptVO {
  id: number
  name: string
  owner: number
  owner_type: string
  active_version: number
  versions: PromptVersionVO[]
  description: string
  create_time: number
  update_time: number
}

export interface CreatePromptRequest {
  name: string
  description: string
  label: string
  content: string
  system_content: string
  temperature: number
  top_n: number
  max_tokens: number
  status: number
}

export interface UpdatePromptRequest {
  id: number
  name: string
  description: string
}

export interface CreateVersionRequest {
  prompt_id: number
  label: string
  content: string
  system_content: string
  temperature: number
  top_n: number
  max_tokens: number
  status: number
}

// Business Configuration types
export interface BizConfig {
  id: number
  name: string
  ownerID: number
  ownerType: "user" | "organization"
  config: string
}

export interface CreateBizConfigRequest {
  name: string
  ownerID: number
  ownerType: "user" | "organization"
  config: string
}

export interface UpdateBizConfigRequest {
  id: number
  name: string
  ownerID: number
  ownerType: "user" | "organization"
  config: string
}

export interface DeleteBizConfigRequest {
  id: number
}
