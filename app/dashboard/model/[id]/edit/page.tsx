"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ModelForm } from "../../components/model-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Model } from "@/lib/types/model"
import { toast } from "@/hooks/use-toast"
import {http} from "@/lib/http";
import {Result} from "@/lib/types/result";

export default function EditModelPage() {
  const params = useParams()
  const id = Number(params.id)

  const [model, setModel] = useState<Model | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // 这里应该调用真实的获取模型详情 API
        const response = await http.post<Result<Model>>(`/models/detail`, {id: id})
        const data = response?.data?.data
        setModel(data)
      } catch (error) {
        console.error("Failed to fetch model details:", error)
        toast({
          title: "错误",
          description: "获取模型详情失败",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  if (!model) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">模型不存在</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/model">返回列表</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/model/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">编辑模型</h1>
          <p className="text-muted-foreground">修改模型信息</p>
        </div>
      </div>

      <ModelForm model={model} />
    </div>
  )
}
