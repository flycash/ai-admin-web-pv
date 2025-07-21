"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Send } from "lucide-react"
import { bizConfigApi } from "@/lib/api"
import { toast } from "sonner"
import type { BizConfig } from "@/lib/types/biz_config"

export function PromptForm() {
  const [prompt, setPrompt] = useState("")
  const [bizConfigId, setBizConfigId] = useState<string>("")
  const [bizConfigs, setBizConfigs] = useState<BizConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingConfigs, setLoadingConfigs] = useState(true)

  // 获取业务配置列表
  useEffect(() => {
    const fetchBizConfigs = async () => {
      try {
        setLoadingConfigs(true)
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
        setLoadingConfigs(false)
      }
    }

    fetchBizConfigs()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) {
      toast.error("请输入提示词")
      return
    }

    if (!bizConfigId) {
      toast.error("请选择业务配置")
      return
    }

    setLoading(true)

    try {
      // 这里应该调用实际的提示词处理 API
      await new Promise((resolve) => setTimeout(resolve, 2000)) // 模拟 API 调用

      toast.success("提示词处理成功")
      setPrompt("")
    } catch (error) {
      console.error("提示词处理失败:", error)
      toast.error("提示词处理失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI 提示词测试</CardTitle>
        <CardDescription>输入您的提示词并选择业务配置进行测试</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bizConfig">业务配置</Label>
            <Select value={bizConfigId} onValueChange={setBizConfigId} disabled={loadingConfigs}>
              <SelectTrigger>
                <SelectValue placeholder={loadingConfigs ? "加载中..." : "选择业务配置"} />
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

          <div className="space-y-2">
            <Label htmlFor="prompt">提示词</Label>
            <Textarea
              id="prompt"
              placeholder="请输入您的提示词..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || !prompt.trim() || !bizConfigId}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                发送
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
