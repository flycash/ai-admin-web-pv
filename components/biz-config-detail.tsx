"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit2, Copy } from "lucide-react"
import Link from "next/link"
import type { BizConfig } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

// Mock data for demonstration
const mockConfig: BizConfig = {
  id: 1,
  name: "用户偏好配置",
  ownerID: 1001,
  ownerType: "user",
  config:
    '{\n  "theme": "dark",\n  "language": "zh",\n  "notifications": {\n    "email": true,\n    "push": false\n  },\n  "preferences": {\n    "timezone": "UTC+8",\n    "date_format": "YYYY-MM-DD"\n  },\n  "security": {\n    "two_factor": true,\n    "session_timeout": 3600\n  }\n}',
}

interface BizConfigDetailProps {
  id: string
}

export function BizConfigDetail({ id }: BizConfigDetailProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [config, setConfig] = useState<BizConfig | null>(null)

  useEffect(() => {
    // In real app, fetch from API: GET /biz-config/:id
    setConfig(mockConfig)
  }, [id])

  const handleCopyConfig = () => {
    if (!config) return
    navigator.clipboard.writeText(config.config)
    toast({
      title: "配置已复制",
      description: "配置 JSON 已复制到剪贴板",
    })
  }

  const getOwnerTypeColor = (ownerType: string) => {
    switch (ownerType) {
      case "user":
        return "default"
      case "organization":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getOwnerTypeText = (ownerType: string) => {
    switch (ownerType) {
      case "user":
        return "用户"
      case "organization":
        return "组织"
      default:
        return ownerType
    }
  }

  const formatJsonForDisplay = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return jsonString
    }
  }

  if (!config) {
    return <div>加载中...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/biz-config")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{config.name}</h1>
          <p className="text-muted-foreground">
            {getOwnerTypeText(config.ownerType)} {config.ownerID} 的配置
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/biz-config/${config.id}/edit`}>
              <Edit2 className="mr-2 h-4 w-4" />
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">ID</div>
                <div className="text-xl font-medium">{config.id}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">名称</div>
                <div className="text-xl font-medium">{config.name}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>所有者信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">所有者 ID</div>
                <div className="text-xl font-medium">{config.ownerID}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">所有者类型</div>
                <Badge variant={getOwnerTypeColor(config.ownerType)}>{getOwnerTypeText(config.ownerType)}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>配置 JSON</CardTitle>
          <CardDescription>JSON 配置数据</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
              {formatJsonForDisplay(config.config)}
            </pre>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleCopyConfig}>
              <Copy className="mr-2 h-4 w-4" />
              复制配置
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
