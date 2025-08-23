"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ModelProviderForm } from "../../components/model-provider-form"
import type { ModelProvider } from "@/lib/types/model"
import {http} from "@/lib/http";
import {Result} from "@/lib/types/result";

export default function EditProviderPage() {
  const params = useParams()
  const id = Number(params.id)

  const [provider, setProvider] = useState<ModelProvider | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProvider = async () => {
      setLoading(true)
      try {
        const response = await http.post<Result<ModelProvider>>('/providers/detail', {id: id})
        const data = response?.data?.data
        setProvider(data)
      } catch (error) {
        console.error("Failed to fetch provider:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProvider()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">服务商不存在</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">编辑服务商</h1>
        <p className="text-muted-foreground">修改 {provider.name} 的配置信息</p>
      </div>

      <ModelProviderForm provider={provider} />
    </div>
  )
}
