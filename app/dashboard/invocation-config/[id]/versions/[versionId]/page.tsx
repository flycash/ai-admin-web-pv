"use client"

import { use, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, CheckCircle } from "lucide-react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
import { http } from "@/lib/http"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {formatLocaleTime} from "@/lib/utils/format"
import type { ConfigVersion } from "@/lib/types/invocation_config"
import type { Result } from "@/lib/types/result"

export default function ConfigVersionDetailPage({
                                                  params,
                                                }: {
  params: Promise<{ id: string; versionId: string }>
}) {
  const { id, versionId } = use(params)
  const invocationConfigId = Number.parseInt(id)
  const { toast } = useToast()
  const [version, setVersion] = useState<ConfigVersion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const resp = await http.post<Result<ConfigVersion>>(`/invocation-configs/versions/detail`, {id: parseInt(versionId)})
        const result = resp.data

        if (result.code === 0) {
          setVersion(result.data)
        } else {
          toast({
            title: "获取版本信息失败",
            description: result.msg || "无法获取配置版本信息",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("获取配置版本失败:", error)
        toast({
          title: "获取版本信息失败",
          description: "网络错误，请稍后重试",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchVersion()
  }, [versionId, toast])

  async function handleActivate() {
    if (!version) return

    try {
      const resp = await http.post<Result<void>>(`/invocation-configs/versions/activate`, { id: parseInt(versionId) })
      const result = resp.data

      if (result.code === 0) {
        toast({
          title: "激活成功",
          description: "配置版本已激活，现在将使用此版本的配置",
        })
        // 更新本地状态
        setVersion({ ...version, status: "active" })
      } else {
        toast({
          title: "激活失败",
          description: result.msg || "激活配置版本失败",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("激活配置版本失败:", error)
      toast({
        title: "激活失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/invocation-config/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <Skeleton className="h-4 w-96" />
            <Skeleton className="h-8 w-48 mt-2" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  if (!version) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/invocation-config/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">配置版本详情</h1>
            <p className="text-muted-foreground">版本不存在</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/invocation-config/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-3xl font-bold tracking-tight">{version.version}</h1>
            <Badge variant={ "default"}>
              {version.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">配置版本详细信息</p>
        </div>
        <div className="flex gap-2">
          {version.status !== "active" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={version.status ==="active"} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  激活
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认激活版本</AlertDialogTitle>
                  <AlertDialogDescription>
                    确定要激活版本 "{version.version}" 吗？激活后将使用此版本的配置。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={handleActivate}>
                    确认激活
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button asChild>
            <Link href={`/dashboard/invocation-config/${id}/versions/${versionId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              编辑
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">版本号</label>
              <p className="text-sm text-muted-foreground mt-1">{version.version}</p>
            </div>
            <div>
              <label className="text-sm font-medium">状态</label>
              <div className="mt-1">
                <Badge variant={ "default"}>
                  {version.status }
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">模型</label>
              <p className="text-sm text-muted-foreground mt-1">{version.modelName}</p>
            </div>
            <div>
              <label className="text-sm font-medium">模型服务商</label>
              <p className="text-sm text-muted-foreground mt-1">{version.modelProviderName}</p>
            </div>
            <div>
              <label className="text-sm font-medium">创建时间</label>
              <p className="text-sm text-muted-foreground mt-1">{formatLocaleTime(version.ctime)}</p>
            </div>
            <div>
              <label className="text-sm font-medium">更新时间</label>
              <p className="text-sm text-muted-foreground mt-1">{formatLocaleTime(version.utime)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>模型参数</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">模型 ID</label>
              <p className="text-sm text-muted-foreground mt-1">{version.modelID}</p>
            </div>
            <div>
              <label className="text-sm font-medium">温度 (Temperature)</label>
              <p className="text-sm text-muted-foreground mt-1">{version.temperature}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Top P</label>
              <p className="text-sm text-muted-foreground mt-1">{version.topP}</p>
            </div>
            <div>
              <label className="text-sm font-medium">最大令牌数</label>
              <p className="text-sm text-muted-foreground mt-1">{version.maxTokens}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {version.systemPrompt && (
        <Card>
          <CardHeader>
            <CardTitle>系统提示词</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md font-mono">{version.systemPrompt}</pre>
          </CardContent>
        </Card>
      )}

      {version.prompt && (
        <Card>
          <CardHeader>
            <CardTitle>用户提示词模板</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md font-mono">{version.prompt}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
