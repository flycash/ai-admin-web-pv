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
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { http } from "@/lib/http"
import { useToast } from "@/hooks/use-toast"
import type { ConfigVersion } from "@/lib/types/llm_invocation"
import type { Result } from "@/lib/types/result"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "版本名称至少需要2个字符。",
  }),
  description: z.string().optional(),
  model: z.string().min(1, {
    message: "请选择模型。",
  }),
  temperature: z.number().min(0).max(2),
  topP: z.number().min(0).max(1),
  maxTokens: z.number().min(1).max(8000),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().optional(),
})

interface ConfigVersionFormProps {
  invocationConfigId: number
  version?: ConfigVersion
}

export function ConfigVersionForm({ invocationConfigId, version }: ConfigVersionFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isActivating, setIsActivating] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      model: "",
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 1000,
      systemPrompt: "",
      userPrompt: "",
    },
  })

  useEffect(() => {
    if (version) {
      form.reset({
        modelID: version.modelID,
        temperature: version.temperature,
        topP: version.topP,
        maxTokens: version.maxTokens,
        systemPrompt: version.systemPrompt || "",
        userPrompt: version.userPrompt || "",
      })
    }
  }, [version, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const payload = {
        cfg: {
          ...values,
          invocationConfigId,
          ...(version && { id: version.id }),
        },
      }

      const resp = await http.post<Result<ConfigVersion>>("/invocation-configs/versions/save", payload)
      const result = resp.data

      if (result.code === 0) {
        toast({
          title: "保存成功",
          description: version ? "配置版本更新成功" : "配置版本创建成功",
        })
        router.push(`/dashboard/invocation-config/${invocationConfigId}`)
      } else {
        toast({
          title: "保存失败",
          description: result.msg || "保存配置版本失败",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("保存配置版本失败:", error)
      toast({
        title: "保存失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleActivate() {
    if (!version) return

    setIsActivating(true)

    try {
      const resp = await http.post<Result<void>>(`/invocation-configs/versions/${version.id}/activate`)
      const result = resp.data

      if (result.code === 0) {
        toast({
          title: "激活成功",
          description: "配置版本已激活，现在将使用此版本的配置",
        })
        // 刷新页面或重新获取数据
        window.location.reload()
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
    } finally {
      setIsActivating(false)
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
              <div className="space-y-2">
                <div>
                  <Badge variant={"default"}>
                    {version?.status || '草稿'}
                  </Badge>
                </div>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>版本名称</FormLabel>
                    <FormControl>
                      <Input placeholder="v1.0" {...field} />
                    </FormControl>
                    <FormDescription>为此版本提供一个名称。</FormDescription>
                    <FormMessage/>
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
                name="model"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>模型</FormLabel>
                    <FormControl>
                      <Input placeholder="gpt-3.5-turbo" {...field} />
                    </FormControl>
                    <FormDescription>选择要使用的AI模型。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>温度: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={2}
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
                name="topP"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Top P: {field.value}</FormLabel>
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
                name="maxTokens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最大令牌数: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={8000}
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
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>系统提示词</FormLabel>
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
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户提示词</FormLabel>
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

        <div className="flex justify-between">
          <div>
            {version && version.status !== 1 && (
              <Button
                type="button"
                variant="default"
                onClick={handleActivate}
                disabled={isActivating}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isActivating ? "激活中..." : "激活此版本"}
              </Button>
            )}
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/invocation-config/${invocationConfigId}`)}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : "保存"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
