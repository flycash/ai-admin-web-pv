"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Edit } from "lucide-react"
import { http } from "@/lib/http"
import { useToast } from "@/hooks/use-toast"
import { ConfigVersionTable } from "./config-version-table"
import type { InvocationConfig } from "@/lib/types/invocation_config"
import {Result} from "@/lib/types/result";
import {formatLocaleTime} from "@/lib/utils/format";
import Link from "next/link";

interface InvocationConfigDetailProps {
  id: number
}

export function InvocationConfigDetail({ id }: InvocationConfigDetailProps) {
  const [config, setConfig] = useState<InvocationConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const resp = await http.post<Result<InvocationConfig>>(`/invocation-configs/basic`, {id: id})
        const result = resp.data
        if (result.code === 0) {
          setConfig(result.data)
        } else {
          toast({
            title: "获取配置失败",
            description: result.msg || "无法获取调用配置信息",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("获取调用配置失败:", error)
        toast({
          title: "获取配置失败",
          description: "网络错误，请稍后重试",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [id, toast])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/invocation-config")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/invocation-config")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">调用配置详情</h1>
            <p className="text-muted-foreground">配置不存在</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/invocation-config")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{config.name}</h1>
            <p className="text-muted-foreground">调用配置详情</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/dashboard/invocation-config/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            编辑配置
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>调用配置的基本信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">配置ID</label>
              <p className="text-sm">{config.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">配置名称</label>
              <p className="text-sm">{config.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">业务</label>
              <p className="text-sm"><Link href={`/biz-config/${config.bizID}`}>{config.bizName}</Link></p>

            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">创建时间</label>
              <p className="text-sm">{formatLocaleTime(config.ctime)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">更新时间</label>
              <p className="text-sm">{formatLocaleTime(config.utime)}</p>
            </div>
          </div>
          {config.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">描述</label>
              <p className="text-sm">{config.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfigVersionTable configId={config.id} />
    </div>
  )
}
