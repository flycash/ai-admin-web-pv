"use client"

import { use, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { http } from "@/lib/http"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import type { ConfigVersion } from "@/lib/types/llm_invocation"
import type { Result } from "@/lib/types/result"

export default function ConfigVersionDetailPage({
  params,
}: {
  params: Promise<{ id: string; versionId: string }>
}) {
  const { id, versionId } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [version, setVersion] = useState<ConfigVersion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const resp = await http.get<Result<ConfigVersion>>(`/invocation-configs/versions/${versionId}`)
        const result = resp.data

        if (result.code === 0) {
          setVersion(result.data)
        } else {
          toast({
            title: "获取版本详情失败",
            description: result.msg || "无法获取配置版本信息",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("获取配置版本详情失败:", error)
        toast({
          title: "获取版本详情失败",
          description: "网络错误，请稍后重试",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchVersion()
  }, [versionId, toast])

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
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-16" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
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
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{version.name}</h1>
            <Badge variant={version.status === 1 ? "default" : "secondary"}>
              {version.status === 1 ? "启用" : "禁用"}
            </Badge>
          </div>
          <p className="text-muted-foreground">创建于 {new Date(version.createdAt).toLocaleString("zh-CN")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/invocation-config/${id}/versions/${versionId}/edit`}>
              <Edit2 className="mr-2 h-4 w-4" />
              编辑
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">模型</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{version.model}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">温度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{version.temperature}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Top P</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{version.topP}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">最大令牌数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{version.maxTokens}</div>
          </CardContent>
        </Card>
      </div>

      {version.systemPrompt && (
        <Card>
          <CardHeader>
            <CardTitle>系统提示词</CardTitle>
            <CardDescription>定义 AI 行为和角色的系统提示词</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md font-mono text-sm">{version.systemPrompt}</pre>
          </CardContent>
        </Card>
      )}

      {version.userPrompt && (
        <Card>
          <CardHeader>
            <CardTitle>用户提示词模板</CardTitle>
            <CardDescription>用户输入的提示词模板</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md font-mono text-sm">{version.userPrompt}</pre>
          </CardContent>
        </Card>
      )}

      {version.description && (
        <Card>
          <CardHeader>
            <CardTitle>版本描述</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{version.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
