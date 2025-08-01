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
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Info } from "lucide-react"
import { http } from "@/lib/http"
import { useToast } from "@/hooks/use-toast"
import type { ConfigVersion} from "@/lib/types/invocation_config"
import type {  ModelProvider, Model } from "@/lib/types/model"
import type {DataList, Result} from "@/lib/types/result"

const formSchema = z.object({
  version: z.string().min(1, {
    message: "版本号不能为空。",
  }),
  prompt: z.string().min(1, {
    message: "提示词内容不能为空。",
  }),
  systemPrompt: z.string().optional(),
  modelID: z.number().min(1, {
    message: "请选择大模型。",
  }),
  topP: z.number().min(0).max(1),
  maxTokens: z.number().min(1).max(100000),
  temperature: z.number().min(0).max(1),
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
  const [providers, setProviders] = useState<ModelProvider[]>([])
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null)
  const [availableModels, setAvailableModels] = useState<Model[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      version: "",
      prompt: "",
      systemPrompt: "",
      modelID: 0,
      topP: 0.9,
      maxTokens: 4096,
      temperature: 0.7,
    },
  })

  // 获取大模型服务商列表
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const resp = await http.post<Result<DataList<ModelProvider>>>("/providers/all")
        const result = resp.data
        if (result.code === 0) {
          setProviders(result.data?.list || [])
        }
      } catch (error) {
        console.error("获取服务商列表失败:", error)
      }
    }

    fetchProviders()
  }, [])

  // 当选择服务商时，更新可用模型列表
  useEffect(() => {
    if (selectedProvider) {
      const provider = providers.find((p) => p.id === selectedProvider)
      if (provider) {
        setAvailableModels(provider.models)
      }
    } else {
      setAvailableModels([])
    }
  }, [selectedProvider, providers])

  // 初始化表单数据
  useEffect(() => {
    if (version) {
      form.reset({
        version: version.version,
        prompt: version.prompt || "",
        systemPrompt: version.systemPrompt || "",
        modelID: version.modelID,
        topP: version.topP,
        maxTokens: version.maxTokens,
        temperature: version.temperature,
      })

      // 根据已选择的模型ID找到对应的服务商
      if (version.modelID && providers.length > 0) {
        for (const provider of providers) {
          const model = provider.models.find((m) => m.id === version.modelID)
          if (model) {
            setSelectedProvider(provider.id)
            break
          }
        }
      }
    }
  }, [version, form, providers])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const payload = {
        version: {
          ...values,
          invID: invocationConfigId,
          ...(version && { id: version.id }),
        },
      }

      const resp = await http.post<Result<number>>("/invocation-configs/versions/save", payload)
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant={"default"}>
                {version?.status || 'draft'}
              </Badge>
              <FormField
                control={form.control}
                name="version"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>版本号</FormLabel>
                    <FormControl>
                      <Input placeholder="v1.0.0" {...field} />
                    </FormControl>
                    <FormDescription>为此版本提供一个版本号。</FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>大模型服务商</FormLabel>
                <Select
                  value={selectedProvider?.toString() || ""}
                  onValueChange={(value) => {
                    const providerId = Number.parseInt(value)
                    setSelectedProvider(providerId)
                    // 清空已选择的模型
                    form.setValue("modelID", 0)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择服务商"/>
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id.toString()}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>选择大模型服务商，如阿里百炼、百度千帆等。</FormDescription>
              </div>

              <FormField
                control={form.control}
                name="modelID"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>大模型</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      disabled={!selectedProvider || availableModels.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择大模型"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableModels.map((model) => (
                          <SelectItem key={model.id} value={model.id.toString()}>
                            <div className="flex flex-col">
                              <span>{model.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>选择要使用的大模型，如 DeepSeek、GPT 等。</FormDescription>
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
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>温度 (Temperature): {field.value}</FormLabel>
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
                    <FormLabel>最大令牌数 (Max Tokens): {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={100000}
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
            <CardTitle className="flex items-center gap-2">
              用户提示词模板
              <Info className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>提示词模板</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请根据以下信息生成回答：&#10;用户姓名：{{.Name}}&#10;用户问题：{{.Question}}&#10;上下文：{{.Context}}"
                      className="min-h-[200px] font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="space-y-2">
                    <span>
                      编写您的提示词模板。使用{" "}
                      <code className="bg-muted px-1 py-0.5 rounded text-sm">{"{{.参数名}}"}</code> 作为参数占位符。
                    </span>
                    <span className="text-xs text-muted-foreground">
                      示例参数：<code>{"{{.Name}}"}</code>、<code>{"{{.Question}}"}</code>、
                      <code>{"{{.Context}}"}</code>
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between">
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
