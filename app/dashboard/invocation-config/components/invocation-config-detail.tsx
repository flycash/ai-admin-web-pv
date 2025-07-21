"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, ArrowLeft, Plus } from "lucide-react"
import { invocationConfigApi } from "@/lib/api"
import { toast } from "sonner"
import { ConfigVersionTable } from "./config-version-table"
import type { InvocationConfig } from "@/lib/types/llm_invocation"

interface InvocationConfigDetailProps {
  configId: string
}

export function InvocationConfigDetail({ configId }: InvocationConfigDetailProps) {
  const [config, setConfig] = useState<InvocationConfig | null>(null)
  const [loading, setLoading] = useState(true)

  // 获取调用配置详情
  const fetchConfig = async () => {
    try {
      setLoading(true)
      const result = await invocationConfigApi.getById(configId)
      if (result.code === 0) {
        setConfig(result.data)
      } else {
        toast.error(result.msg || "获取调用配置详情失败")
      }
    } catch (error) {
      console.error("获取调用配置详情失败:", error)
      toast.error("获取调用配置详情失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [configId])

  // 格式化时间
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("zh-CN")
  }

  // 获取活跃版本数量
  const getActiveVersionsCount = () => {
    return config?.versions?.filter((v) => v.status === "ACTIVE").length || 0
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">未找到调用配置</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/invocation-config">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 头部操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/invocation-config">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{config.name}</h1>
            <p className="text-muted-foreground">调用配置详情</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/dashboard/invocation-config/${configId}/versions/new`}>
              <Plus className="mr-2 h-4 w-4" />
              新建版本
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/invocation-config/${configId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              编辑配置
            </Link>
          </Button>
        </div>
      </div>

      {/* 配置基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>调用配置的基本信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">配置名称</p>
              <p className="font-medium">{config.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">业务配置ID</p>
              <Badge variant="outline">{config.bizID}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">版本数量</p>
              <Badge variant="secondary">{config.versions?.length || 0}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">活跃版本</p>
              <Badge variant={getActiveVersionsCount() > 0 ? "default" : "secondary"}>{getActiveVersionsCount()}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">创建时间</p>
              <p className="text-sm">{formatDate(config.ctime)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">更新时间</p>
              <p className="text-sm">{formatDate(config.utime)}</p>
            </div>
          </div>
          {config.description && (
            <div className="mt-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">描述</p>
              <p className="text-sm">{config.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 版本管理 */}
      <Card>
        <CardHeader>
          <CardTitle>版本管理</CardTitle>
          <CardDescription>管理该调用配置的所有版本</CardDescription>
        </CardHeader>
        <CardContent>
          <ConfigVersionTable configId={configId} onVersionChange={fetchConfig} />
        </CardContent>
      </Card>
    </div>
  )
}
