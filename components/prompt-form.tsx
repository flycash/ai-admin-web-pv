"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

// Mock data matching backend PromptVersionVO structure
const mockPrompts = [
  {
    id: 1,
    label: "文本摘要",
    content: "用要点形式总结以下文本：\n\n{{text}}",
    system_content: "你是一个专门从事文本摘要的有用助手。",
    temperature: 0.7,
    top_n: 0.9,
    max_tokens: 500,
    status: 1,
    biz_config_id: 1,
  },
  {
    id: 2,
    label: "代码生成",
    content: "编写 {{language}} 代码来解决以下问题：\n\n{{problem}}",
    system_content: "你是一个编写干净、高效代码的专家程序员。",
    temperature: 0.2,
    top_n: 1.0,
    max_tokens: 1000,
    status: 1,
    biz_config_id: 2,
  },
  {
    id: 3,
    label: "创意写作",
    content: "写一个关于 {{topic}} 的 {{genre}} 故事",
    system_content: "你是一个具有出色讲故事能力的创意作家。",
    temperature: 0.9,
    top_n: 0.95,
    max_tokens: 2000,
    status: 0,
    biz_config_id: 1,
  },
]

interface BizConfig {
  id: number
  name: string
  ownerID: number
  ownerType: "user" | "organization"
  config: string
}

const formSchema = z.object({
  label: z.string().min(2, {
    message: "标签至少需要2个字符。",
  }),
  content: z.string().min(10, {
    message: "内容至少需要10个字符。",
  }),
  system_content: z.string().min(5, {
    message: "系统内容至少需要5个字符。",
  }),
  temperature: z.number().min(0).max(1),
  top_n: z.number().min(0).max(1),
  max_tokens: z.number().min(1).max(4000),
  status: z.number().min(0).max(1),
  biz_config_id: z.number().min(1, {
    message: "请选择一个业务配置。",
  }),
})

interface PromptFormProps {
  id?: string
}

export function PromptForm({ id }: PromptFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [bizConfigs, setBizConfigs] = useState<BizConfig[]>([])
  const [loadingBizConfigs, setLoadingBizConfigs] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      content: "",
      system_content: "",
      temperature: 0.7,
      top_n: 0.9,
      max_tokens: 500,
      status: 1,
      biz_config_id: 0,
    },
  })

  // 获取业务配置列表
  useEffect(() => {
    const fetchBizConfigs = async () => {
      try {
        setLoadingBizConfigs(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9002"}/biz_config`, {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("获取业务配置失败")
        }

        const result = await response.json()
        if (result.code === 0) {
          setBizConfigs(result.data || [])
        } else {
          throw new Error(result.msg || "获取业务配置失败")
        }
      } catch (error) {
        console.error("Error fetching business configurations:", error)
        toast({
          title: "错误",
          description: "获取业务配置失败",
          variant: "destructive",
        })
      } finally {
        setLoadingBizConfigs(false)
      }
    }

    fetchBizConfigs()
  }, [toast])

  useEffect(() => {
    if (id) {
      // In a real app, fetch the prompt data from API: GET /prompt/:id
      const prompt = mockPrompts.find((p) => p.id.toString() === id)
      if (prompt) {
        form.reset(prompt)
      }
    }
  }, [id, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      if (id) {
        // Update existing prompt: POST /prompt/update/version
        const response = await fetch("/api/prompt/update/version", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: Number.parseInt(id),
            ...values,
          }),
        })

        if (!response.ok) {
          throw new Error("更新提示词失败")
        }

        const result = await response.json()
        if (result.code !== 0) {
          throw new Error(result.msg || "更新提示词失败")
        }

        toast({
          title: "成功",
          description: "提示词更新成功",
        })
      } else {
        // Create new prompt: POST /prompt/add
        const response = await fetch("/api/prompt/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          throw new Error("创建提示词失败")
        }

        const result = await response.json()
        if (result.code !== 0) {
          throw new Error(result.msg || "创建提示词失败")
        }

        toast({
          title: "成功",
          description: "提示词创建成功",
        })
      }

      router.push("/dashboard/prompts")
    } catch (error) {
      console.error("Error saving prompt:", error)
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "保存提示词失败",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标签</FormLabel>
                    <FormControl>
                      <Input placeholder="文本摘要" {...field} />
                    </FormControl>
                    <FormDescription>为您的提示词提供一个描述性标签。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="biz_config_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>业务配置</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      value={field.value > 0 ? field.value.toString() : ""}
                      disabled={loadingBizConfigs}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingBizConfigs ? "加载中..." : "选择业务配置"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bizConfigs.map((config) => (
                          <SelectItem key={config.id} value={config.id.toString()}>
                            {config.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>为此提示词选择业务配置。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>状态</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">激活</SelectItem>
                        <SelectItem value="0">未激活</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>设置此提示词的状态。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>模型参数</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>温度: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormDescription>控制随机性：较低的值更确定，较高的值更有创意。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="top_n"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Top N: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormDescription>通过核采样控制多样性：0.5 意味着考虑一半的可能性加权选项。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_tokens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最大令牌数: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={4000}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormDescription>在完成中生成的最大令牌数。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>系统提示词</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="system_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>系统内容</FormLabel>
                  <FormControl>
                    <Textarea placeholder="你是一个有用的助手..." className="min-h-[100px] font-mono" {...field} />
                  </FormControl>
                  <FormDescription>定义 AI 行为和角色的系统提示词。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>用户提示词模板</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>内容</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="在这里编写您的提示词模板。使用 {{变量}} 作为占位符。"
                      className="min-h-[200px] font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>编写您的提示词模板。使用双大括号表示变量，例如 {"{{变量}}"}。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/prompts")}>
            取消
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "保存中..." : id ? "更新提示词" : "创建提示词"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
