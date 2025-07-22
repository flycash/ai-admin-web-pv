"use client"

import { use, useState, useEffect } from "react"
import { ConfigVersionForm } from "../../../../components/config-version-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { http } from "@/lib/http"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import type { ConfigVersion } from "@/lib/types/invocation_config"
import type { Result } from "@/lib/types/result"

export default function EditConfigVersionPage({
  params,
}: {
  params: Promise<{ id: string; versionId: string }>
}) {
  const { id, versionId } = use(params)
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
            title: "获取版本信息失败",
            description: result.msg || "无法获取配置版本信息",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("获取配置版本信息失败:", error)
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/invocation-config/${id}/versions/${versionId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
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
            <h1 className="text-3xl font-bold">编辑配置版本</h1>
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
          <Link href={`/dashboard/invocation-config/${id}/versions/${versionId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">编辑配置版本</h1>
          <p className="text-muted-foreground">修改配置版本信息</p>
        </div>
      </div>
      <ConfigVersionForm invocationConfigId={Number.parseInt(id)} version={version} />
    </div>
  )
}
