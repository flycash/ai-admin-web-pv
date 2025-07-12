"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit2, GitBranch, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { PromptVersionVO } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

// Mock data - in real app, fetch from API
const mockVersion: PromptVersionVO = {
  id: 2,
  label: "v1.1",
  content: "用要点形式总结以下文本：\n\n{{text}}",
  system_content: "你是一个专门从事文本摘要的有用助手。",
  temperature: 0.7,
  top_n: 0.9,
  max_tokens: 500,
  status: 1,
  ctime: 1684224000000,
  utime: 1684224000000,
}

interface VersionDetailProps {
  promptId: string
  versionId: string
}

export function VersionDetail({ promptId, versionId }: VersionDetailProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [version, setVersion] = useState<PromptVersionVO | null>(null)
  const [isForking, setIsForking] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    // In real app, fetch from API: GET /prompt/:id/version/:versionId
    setVersion(mockVersion)
  }, [promptId, versionId])

  const handleForkVersion = async () => {
    if (!version) return

    setIsForking(true)

    try {
      // In a real app, call API to fork version: POST /prompt/fork
      await new Promise((resolve) => setTimeout(resolve, 800))

      toast({
        title: "版本已分支",
        description: `版本 ${version.label}-分支 已创建`,
      })

      // Navigate back to prompt detail
      router.push(`/dashboard/prompts/${promptId}`)
    } catch (error) {
      console.error("Error forking version:", error)
      toast({
        title: "分支失败",
        description: "创建分支版本失败",
        variant: "destructive",
      })
    } finally {
      setIsForking(false)
    }
  }

  const handlePublishVersion = async () => {
    if (!version) return

    setIsPublishing(true)

    try {
      // In a real app, call API to publish version: POST /prompt/publish
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setVersion({
        ...version,
        status: 1,
        utime: Date.now(),
      })

      toast({
        title: "版本已发布",
        description: `版本 ${version.label} 已发布`,
      })
    } catch (error) {
      console.error("Error publishing version:", error)
      toast({
        title: "发布失败",
        description: "发布版本失败",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  if (!version) {
    return <div>加载中...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">版本 {version.label}</h1>
            <Badge variant={version.status === 1 ? "default" : "secondary"}>
              {version.status === 1 ? "已发布" : "草稿"}
            </Badge>
          </div>
          <p className="text-muted-foreground">创建于 {new Date(version.ctime).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/prompts/${promptId}/versions/${versionId}/edit`}>
              <Edit2 className="mr-2 h-4 w-4" />
              编辑
            </Link>
          </Button>
          <Button variant="outline" onClick={handleForkVersion} disabled={isForking || isPublishing}>
            <GitBranch className={`mr-2 h-4 w-4 ${isForking ? "animate-spin" : ""}`} />
            分支
          </Button>
          {version.status === 0 && (
            <Button onClick={handlePublishVersion} disabled={isPublishing || isForking}>
              <Upload className={`mr-2 h-4 w-4 ${isPublishing ? "animate-pulse" : ""}`} />
              发布
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
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
            <CardTitle className="text-sm">Top N</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{version.top_n}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">最大令牌数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{version.max_tokens}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>系统提示词</CardTitle>
          <CardDescription>定义 AI 行为和角色的系统提示词</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md font-mono text-sm">{version.system_content}</pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>用户提示词模板</CardTitle>
          <CardDescription>用户输入的提示词模板</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md font-mono text-sm">{version.content}</pre>
        </CardContent>
      </Card>
    </div>
  )
}
