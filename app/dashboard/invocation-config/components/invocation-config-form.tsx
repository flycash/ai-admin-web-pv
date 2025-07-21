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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { bizConfigApi, invocationConfigApi, type BizConfigVO } from "@/lib/api"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "名称至少需要2个字符。",
  }),
  description: z.string().min(5, {
    message: "描述至少需要5个字符。",
  }),
  bizID: z.number().min(1, {
    message: "请选择一个业务配置。",
  }),
})

interface InvocationConfigFormProps {
  id?: string
}

export function InvocationConfigForm({ id }: InvocationConfigFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [bizConfigs, setBizConfigs] = useState<BizConfigVO[]>([])
  const [loadingBizConfigs, setLoadingBizConfigs] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      bizID: 0,
    },
  })

  // 获取业务配置列表
  useEffect(() => {
    const fetchBizConfigs = async () => {
      try {
        setLoadingBizConfigs(true)
        const result = await bizConfigApi.list(1, 100) // 获取所有业务配置

        if (result.code === 0) {
          const data = Array.isArray(result.data) ? result.data : result.data.data || []
          setBizConfigs(data)
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

  // 如果是编辑模式，获取现有数据
  useEffect(() => {
    if (id) {
      const fetchConfig = async () => {
        try {
          const result = await invocationConfigApi.get(Number.parseInt(id))
          if (result.code === 0) {
            const config = result.data
            form.reset({
              name: config.name,
              description: config.description,
              bizID: config.bizID,
            })
          }
        } catch (error) {
          console.error("Error fetching invocation config:", error)
          toast({
            title: "错误",
            description: "获取调用配置失败",
            variant: "destructive",
          })
        }
      }

      fetchConfig()
    }
  }, [id, form, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      if (id) {
        // 更新现有调用配置
        const result = await invocationConfigApi.update(Number.parseInt(id), {
          name: values.name,
          description: values.description,
        })

        if (result.code === 0) {
          toast({
            title: "成功",
            description: "调用配置更新成功",
          })
        } else {
          throw new Error(result.msg || "更新调用配置失败")
        }
      } else {
        // 创建新调用配置
        const result = await invocationConfigApi.create({
          bizID: values.bizID,
          name: values.name,
          description: values.description,
        })

        if (result.code === 0) {
          toast({
            title: "成功",
            description: "调用配置创建成功",
          })
        } else {
          throw new Error(result.msg || "创建调用配置失败")
        }
      }

      router.push("/dashboard/invocation-config")
    } catch (error) {
      console.error("Error saving invocation config:", error)
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "保存调用配置失败",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入调用配置名称" {...field} />
                  </FormControl>
                  <FormDescription>为您的调用配置提供一个描述性名称。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea placeholder="输入调用配置描述" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormDescription>详细描述此调用配置的用途和功能。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!id && (
              <FormField
                control={form.control}
                name="bizID"
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
                    <FormDescription>选择此调用配置关联的业务配置。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/invocation-config")}>
            取消
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "保存中..." : id ? "更新调用配置" : "创建调用配置"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
