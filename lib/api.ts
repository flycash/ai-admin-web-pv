// API utility functions for prompt and business config management

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

export interface CreatePromptRequest {
  label: string
  content: string
  system_content: string
  temperature: number
  top_n: number
  max_tokens: number
  status: number
}

export interface UpdatePromptRequest extends CreatePromptRequest {
  id: number
}

export interface DeletePromptRequest {
  id: number
}

// Business Configuration API types
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// Prompt API functions
export async function createPrompt(data: CreatePromptRequest): Promise<PromptVersionVO> {
  const response = await fetch(`${API_BASE_URL}/prompt/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create prompt")
  }

  return response.json()
}

export async function getPrompt(id: number): Promise<PromptVersionVO> {
  const response = await fetch(`${API_BASE_URL}/prompt/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch prompt")
  }

  return response.json()
}

export async function updatePrompt(data: UpdatePromptRequest): Promise<PromptVersionVO> {
  const response = await fetch(`${API_BASE_URL}/prompt/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update prompt")
  }

  return response.json()
}

export async function updatePromptVersion(data: UpdatePromptRequest): Promise<PromptVersionVO> {
  const response = await fetch(`${API_BASE_URL}/prompt/update/version`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update prompt version")
  }

  return response.json()
}

export async function deletePrompt(data: DeletePromptRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/prompt/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to delete prompt")
  }
}

export async function deletePromptVersion(data: DeletePromptRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/prompt/delete/version`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to delete prompt version")
  }
}

export async function publishPrompt(data: DeletePromptRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/prompt/publish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to publish prompt")
  }
}

export async function forkPrompt(data: DeletePromptRequest): Promise<PromptVersionVO> {
  const response = await fetch(`${API_BASE_URL}/prompt/fork`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to fork prompt")
  }

  return response.json()
}

// Business Configuration API functions
export async function createBizConfig(data: CreateBizConfigRequest): Promise<BizConfig> {
  const response = await fetch(`${API_BASE_URL}/biz-config/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create business configuration")
  }

  return response.json()
}

export async function getBizConfig(id: number): Promise<BizConfig> {
  const response = await fetch(`${API_BASE_URL}/biz-config/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch business configuration")
  }

  return response.json()
}

export async function updateBizConfig(data: UpdateBizConfigRequest): Promise<BizConfig> {
  const response = await fetch(`${API_BASE_URL}/biz-config/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update business configuration")
  }

  return response.json()
}

export async function deleteBizConfig(data: DeleteBizConfigRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/biz-config/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to delete business configuration")
  }
}

export async function listBizConfigs(): Promise<BizConfig[]> {
  const response = await fetch(`${API_BASE_URL}/biz-config/list`)

  if (!response.ok) {
    throw new Error("Failed to fetch business configurations")
  }

  return response.json()
}
