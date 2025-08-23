"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, ArrowLeft, Plus, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import type { ModelProvider } from "@/lib/types/model"
import { http } from "@/lib/http"
import type { Result } from "@/lib/types/result"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function providerDetail(id: number) {
  return http.post<Result<ModelProvider>>("/providers/detail", { id: id })
}

export default function ProviderDetailPage() {
  const params = useParams()
  const id = Number(params.id)

  const [provider, setProvider] = useState<ModelProvider | null>(null)
  const [loading, setLoading] = useState(true)
  const [deletingModelId, setDeletingModelId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const resp = await providerDetail(id)
        const result = resp?.data?.data
        setProvider(result)
      } catch (error) {
        console.error("Failed to fetch provider details:", error)
        toast({
          title: "错误",
          description: "获取服务商详情失败",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const maskApiKey = (apiKey: string) => {
    if (apiKey.length <= 8) return apiKey
    return apiKey.substring(0, 8) + "*".repeat(Math.min(apiKey.length - 8, 15))
  }

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
        <Button asChild className="mt-4">
          <Link href="/dashboard/provider">返回列表</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/provider">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{provider.name}</h1>
            <p className="text-muted-foreground">服务商详情</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/provider/${provider.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            编辑
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID</label>
              <p className="font-mono text-sm">{provider.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">名称</label>
              <p className="font-medium">{provider.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">API Key</label>
              <p className="font-mono text-sm">{maskApiKey(provider.apiKey)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>关联模型 ({provider?.models?.length || 0})</CardTitle>
              <Button asChild>
                <Link href={`/dashboard/model/new?pid=${provider.id}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  创建模型
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {provider?.models?.length > 0 ? (
              <div className="space-y-3">
                {provider.models.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{model.name}</span>
                        <Badge variant="secondary">ID: {model.id}</Badge>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span>输入价格: ¥{model.inputPrice}/百万token</span>
                        <span className="ml-4">输出价格: ¥{model.outputPrice}/百万token</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/model/${model.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">查看详情</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/model/${model.id}/edit`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">编辑</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">暂无关联模型</p>
                <Button asChild>
                  <Link href={`/dashboard/model/new?pid=${provider.id}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    创建第一个模型
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
