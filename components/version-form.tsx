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

// Mock data for existing version
const mockVersion = {
  id: 1,
  label: "v1.0",
  content: "总结以下文本：\n\n{{text}}",
  system_content: "你是一个专门从事文本摘要的有用助手。",
  temperature: 0.7,
  top_n: 0.9,
  max_tokens: 500,
  status: 0,
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
})

interface VersionFormProps {
  promptId: string
  versionId?: string
}

export function VersionForm({ promptId, versionId }: VersionFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      content: "",
      system_content: "",
      temperature: 0.7,
      top_n: 0.9,
      max_tokens: 500,
      status: 0,
    },
  })

  useEffect(() => {
    if (versionId) {
      // In a real app, fetch the version data from API: GET /prompt/:id/version/:versionId
      form.reset(mockVersion)
    }
  }, [versionId, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      if (versionId) {
        // Update existing version
        const response = await fetch(`/api/prompt/${promptId}/version/${versionId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          throw new Error("更新版本失败")
        }

        const result = await response.json()
        if (result.code !== 0) {
          throw new Error(result.msg || "更新版本失败")
        }

        toast({
          title: "成功",
          description: "版本更新成功",
        })
      } else {
        // Create new version
        const response = await fetch(`/api/prompt/${promptId}/version`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          throw new Error("创建版本失败")
        }

        const result = await response.json()
        if (result.code !== 0) {
          throw new Error(result.msg || "创建版本失败")
        }

        toast({
          title: "成功",
          description: "版本创建成功",
        })
      }

      router.push(`/dashboard/prompts/${promptId}`)
    } catch (error) {
      console.error("Error saving version:", error)
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "保存版本失败",
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
                    <FormLabel>版本标签</FormLabel>
                    <FormControl>
                      <Input placeholder="v1.0" {...field} />
                    </FormControl>
                    <FormDescription>为此版本提供一个标签。</FormDescription>
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
                        <SelectItem value="1">已发布</SelectItem>
                        <SelectItem value="0">草稿</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>设置此版本的状态。</FormDescription>
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
          <Button type="button" variant="outline" onClick={() => router.push(`/dashboard/prompts/${promptId}`)}>
            取消
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "保存中..." : versionId ? "更新版本" : "创建版本"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
