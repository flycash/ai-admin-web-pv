import type { ModelProvider, Model, PaginatedResponse } from "@/lib/types/model"

// Mock data for ModelProvider
const mockProviders: ModelProvider[] = [
  {
    id: "1",
    name: "OpenAI",
    apiKey: "sk-proj-*********************",
  },
  {
    id: "2",
    name: "Anthropic",
    apiKey: "sk-ant-*********************",
  },
  {
    id: "3",
    name: "Google",
    apiKey: "AIza*********************",
  },
  {
    id: "4",
    name: "Baidu",
    apiKey: "24.*********************",
  },
  {
    id: "5",
    name: "Alibaba",
    apiKey: "sk-*********************",
  },
]

// Mock data for Model
const mockModels: Model[] = [
  {
    id: "1",
    pid: "1",
    name: "gpt-4",
  },
  {
    id: "2",
    pid: "1",
    name: "gpt-3.5-turbo",
  },
  {
    id: "3",
    pid: "1",
    name: "gpt-4-turbo",
  },
  {
    id: "4",
    pid: "2",
    name: "claude-3-opus",
  },
  {
    id: "5",
    pid: "2",
    name: "claude-3-sonnet",
  },
  {
    id: "6",
    pid: "2",
    name: "claude-3-haiku",
  },
  {
    id: "7",
    pid: "3",
    name: "gemini-pro",
  },
  {
    id: "8",
    pid: "3",
    name: "gemini-pro-vision",
  },
  {
    id: "9",
    pid: "4",
    name: "ernie-bot-4",
  },
  {
    id: "10",
    pid: "4",
    name: "ernie-bot-turbo",
  },
  {
    id: "11",
    pid: "5",
    name: "qwen-max",
  },
  {
    id: "12",
    pid: "5",
    name: "qwen-plus",
  },
]

// Provider API functions
export const providerApi = {
  // Get paginated list of providers
  async list(page = 1, pageSize = 10, search?: string): Promise<PaginatedResponse<ModelProvider>> {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

    let filteredProviders = mockProviders
    if (search) {
      filteredProviders = mockProviders.filter((provider) => provider.name.toLowerCase().includes(search.toLowerCase()))
    }

    const total = filteredProviders.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const data = filteredProviders.slice(start, end)

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  },

  // Get all providers (for dropdowns)
  async getAll(): Promise<ModelProvider[]> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockProviders
  },

  // Get provider by ID
  async get(id: string): Promise<ModelProvider | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockProviders.find((provider) => provider.id === id) || null
  },

  // Create new provider
  async create(data: Omit<ModelProvider, "id">): Promise<ModelProvider> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const newProvider: ModelProvider = {
      ...data,
      id: String(mockProviders.length + 1),
    }
    mockProviders.push(newProvider)
    return newProvider
  },

  // Update provider
  async update(id: string, data: Partial<Omit<ModelProvider, "id">>): Promise<ModelProvider | null> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const index = mockProviders.findIndex((provider) => provider.id === id)
    if (index === -1) return null

    mockProviders[index] = { ...mockProviders[index], ...data }
    return mockProviders[index]
  },

  // Delete provider
  async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    const index = mockProviders.findIndex((provider) => provider.id === id)
    if (index === -1) return false

    mockProviders.splice(index, 1)
    // Also delete related models
    const modelIndexes = mockModels.map((model, idx) => (model.pid === id ? idx : -1)).filter((idx) => idx !== -1)
    modelIndexes.reverse().forEach((idx) => mockModels.splice(idx, 1))

    return true
  },
}

// Model API functions
export const modelApi = {
  // Get paginated list of models
  async list(
    page = 1,
    pageSize = 10,
    search?: string,
    providerId?: string,
  ): Promise<PaginatedResponse<Model & { providerName: string }>> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredModels = mockModels.map((model) => ({
      ...model,
      providerName: mockProviders.find((p) => p.id === model.pid)?.name || "Unknown",
    }))

    if (search) {
      filteredModels = filteredModels.filter((model) => model.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (providerId) {
      filteredModels = filteredModels.filter((model) => model.pid === providerId)
    }

    const total = filteredModels.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const data = filteredModels.slice(start, end)

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  },

  // Get model by ID
  async get(id: string): Promise<(Model & { providerName: string }) | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const model = mockModels.find((model) => model.id === id)
    if (!model) return null

    const provider = mockProviders.find((p) => p.id === model.pid)
    return {
      ...model,
      providerName: provider?.name || "Unknown",
    }
  },

  // Get models by provider ID
  async getByProvider(providerId: string): Promise<Model[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockModels.filter((model) => model.pid === providerId)
  },

  // Create new model
  async create(data: Omit<Model, "id">): Promise<Model> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const newModel: Model = {
      ...data,
      id: String(mockModels.length + 1),
    }
    mockModels.push(newModel)
    return newModel
  },

  // Update model
  async update(id: string, data: Partial<Omit<Model, "id">>): Promise<Model | null> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const index = mockModels.findIndex((model) => model.id === id)
    if (index === -1) return null

    mockModels[index] = { ...mockModels[index], ...data }
    return mockModels[index]
  },

  // Delete model
  async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    const index = mockModels.findIndex((model) => model.id === id)
    if (index === -1) return false

    mockModels.splice(index, 1)
    return true
  },
}
