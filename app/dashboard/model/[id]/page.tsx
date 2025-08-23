"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Model } from "@/lib/types/model"
import { toast } from "@/hooks/use-toast"
import {Result} from "@/lib/types/result";
import {http} from "@/lib/http";
import {mode} from "d3-array";

export default function ModelDetailPage() {
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

        // 临时使用 mock 数据
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/model">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{model.name}</h1>
            <p className="text-muted-foreground">模型详情</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/model/${model.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            编辑
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">ID</label>
            <p className="font-mono text-sm">{model.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">模型名称</label>
            <p className="font-medium">{model.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">服务商</label>
            <p className="font-medium">
              <Link href={`/dashboard/provider/${model?.provider?.id}`}>
              {model.provider?.name || '未知'}
              </Link>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">输入价格</label>
              <p className="font-medium">¥{model.inputPrice}/百万token</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">输出价格</label>
              <p className="font-medium">¥{model.outputPrice}/百万token</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
