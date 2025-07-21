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
