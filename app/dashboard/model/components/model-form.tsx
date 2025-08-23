"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import type { Model, ModelProvider } from "@/lib/types/model"
import {http} from "@/lib/http";
import {DataList, Result} from "@/lib/types/result";

interface ModelFormProps {
  model?: Model
  providerId?: number
}

export function ModelForm({ model, providerId }: ModelFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [providers, setProviders] = useState<ModelProvider[]>([])
  const [pid, setPid] = useState(providerId || 0)
  const [formData, setFormData] = useState({
    name: model?.name || "",
    provider: model?.provider || {id: 0},
    inputPrice: model?.inputPrice || 0,
    outputPrice: model?.outputPrice || 0,
  })

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        // 这里应该调用真实的获取所有服务商的 API
        // const data = await providerApi.getAll()
        // setProviders(data)

        // 默认不可能会有很多 provider，所以直接获取全部
        const response = await http.post<Result<DataList<ModelProvider>>>('/providers/list', {
          offset: 0,
          limit: 100,
        })

        const data = response?.data?.data?.list || []

        // 临时使用 mock 数据
        setProviders(data)
      } catch (error) {
        console.error("Failed to fetch providers:", error)
        toast({
          title: "错误",
          description: "获取服务商列表失败",
          variant: "destructive",
        })
      }
    }
    fetchProviders()

    if (providerId) {
      setPid(providerId)
    }
    if (model) {
      setPid(model.provider?.id || 0)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: "错误",
        description: "请输入模型名称",
        variant: "destructive",
      })
      return
    }

    if (!formData.provider) {
      toast({
        title: "错误",
        description: "请选择服务商",
        variant: "destructive",
      })
      return
    }

    if (formData.inputPrice < 0 || formData.outputPrice < 0) {
      toast({
        title: "错误",
        description: "价格不能为负数",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const saveData = {
        ...formData,
        ...(model?.id && { id: model.id }),
        provider: {
          id: pid,
        }
      }

      // 这里应该调用真实的保存 API
      // await modelApi.save(saveData)

      await http.post<Result<Model>>("/models/save", saveData)

      toast({
        title: "成功",
        description:"保存成功",
      })

      router.push(`/dashboard/provider/${pid}`)
    } catch (error) {
      console.error("Failed to save model:", error)
      toast({
        title: "错误",
        description: "保存成功",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{model ? "编辑模型" : "创建模型"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">模型名称 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="请输入模型名称"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">服务商 *</Label>
            <Select
              value={pid.toString()}
              onValueChange={(value) => handleInputChange("pid", Number(value))}
              disabled={true}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择服务商" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id.toString()}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inputPrice">输入价格 (¥/百万token) *</Label>
              <Input
                id="inputPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.inputPrice}
                onChange={(e) => handleInputChange("inputPrice", Number(e.target.value))}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outputPrice">输出价格 (¥/百万token) *</Label>
              <Input
                id="outputPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.outputPrice}
                onChange={(e) => handleInputChange("outputPrice", Number(e.target.value))}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (providerId) {
                  router.push(`/dashboard/provider/${providerId}`)
                } else {
                  router.push("/dashboard/model")
                }
              }}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
