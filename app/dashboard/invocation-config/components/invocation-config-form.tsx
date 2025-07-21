"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"
import { invocationConfigApi, bizConfigApi } from "@/lib/api"
import { toast } from "sonner"
import type {
  InvocationConfig,
  CreateInvocationConfigRequest,
  UpdateInvocationConfigRequest,
} from "@/lib/types/llm_invocation"
import type { BizConfig } from "@/lib/types/biz_config"

interface InvocationConfigFormProps {
  config?: InvocationConfig
  mode: "create" | "edit"
}

export function InvocationConfigForm({ config, mode }: InvocationConfigFormProps) {
  const [name, setName] = useState(config?.name || "")
  const [description, setDescription] = useState(config?.description || "")
  const [bizID, setBizID] = useState(config?.bizID?.toString() || "")
  const [bizConfigs, setBizConfigs] = useState<BizConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingBizConfigs, setLoadingBizConfigs] = useState(true)
  const router = useRouter()

  // 获取业务配置列表
  useEffect(() => {
    const fetchBizConfigs = async () => {
      try {
        setLoadingBizConfigs(true)
        const result = await bizConfigApi.getList()
        if (result.code === 0) {
          setBizConfigs(result.data.data || [])
        } else {
          toast.error("获取业务配置失败")
        }
      } catch (error) {
        console.error("获取业务配置失败:", error)
        toast.error("获取业务配置失败")
      } finally {
        setLoadingBizConfigs(false)
      }
    }

    fetchBizConfigs()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("请输入配置名称")
      return
    }

    if (!bizID) {
      toast.error("请选择业务配置")
      return
    }

    setLoading(true)

    try {
      if (mode === "create") {
        const data: CreateInvocationConfigRequest = {
          name: name.trim(),
          description: description.trim(),
          bizID: Number.parseInt(bizID),
        }
        const result = await invocationConfigApi.create(data)
        if (result.code === 0) {
          toast.success("调用配置创建成功")
          router.push("/dashboard/invocation-config")
        } else {
          toast.error(result.msg || "创建调用配置失败")
        }
      } else {
        const data: UpdateInvocationConfigRequest = {
          name: name.trim(),
          description: description.trim(),
        }
        const result = await invocationConfigApi.update(config!.bizID.toString(), data)
        if (result.code === 0) {
          toast.success("调用配置更新成功")
          router.push(`/dashboard/invocation-config/${config!.bizID}`)
        } else {
          toast.error(result.msg || "更新调用配置失败")
        }
      }
    } catch (error) {
      console.error(`${mode === "create" ? "创建" : "更新"}调用配置失败:`, error)
      toast.error(`${mode === "create" ? "创建" : "更新"}调用配置失败`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === "create" ? "创建调用配置" : "编辑调用配置"}</CardTitle>
        <CardDescription>{mode === "create" ? "创建新的调用配置" : "修改调用配置信息"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">配置名称 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入配置名称"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入配置描述"
              rows={3}
              disabled={loading}
            />
          </div>

          {mode === "create" && (
            <div className="space-y-2">
              <Label htmlFor="bizID">业务配置 *</Label>
              <Select value={bizID} onValueChange={setBizID} disabled={loading || loadingBizConfigs}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingBizConfigs ? "加载中..." : "选择业务配置"} />
                </SelectTrigger>
                <SelectContent>
                  {bizConfigs.map((config) => (
                    <SelectItem key={config.id} value={config.id.toString()}>
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading || !name.trim() || (mode === "create" && !bizID)}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "创建中..." : "更新中..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === "create" ? "创建" : "更新"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
