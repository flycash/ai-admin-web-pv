"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { bizConfigApi } from "@/lib/api"
import type { BizConfig } from "@/lib/types/biz_config"

const formSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  description: z.string().optional(),
  content: z.string().min(1, "内容不能为空"),
  biz_config_id: z.string().min(1, "请选择业务配置"),
})

type FormData = z.infer<typeof formSchema>

interface PromptFormProps {
  initialData?: Partial<FormData>
  onSubmit: (data: FormData) => Promise<void>
  isLoading?: boolean
}

export function PromptForm({ initialData, onSubmit, isLoading = false }: PromptFormProps) {
  const [bizConfigs, setBizConfigs] = useState<BizConfig[]>([])
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
      biz_config_id: initialData?.biz_config_id || "",
    },
  })

  // 获取业务配置列表
  useEffect(() => {
    const fetchBizConfigs = async () => {
      try {
        const result = await bizConfigApi.getAll()
        if (result.success && result.data) {
          setBizConfigs(result.data)
        } else {
          toast({
            title: "获取业务配置失败",
            description: result.message || "请稍后重试",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "获取业务配置失败",
          description: "网络错误，请稍后重试",
          variant: "destructive",
        })
      } finally {
        setIsLoadingConfigs(false)
      }
    }

    fetchBizConfigs()
  }, [toast])

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      // 错误处理由父组件负责
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "编辑提示词" : "创建提示词"}</CardTitle>
        <CardDescription>{initialData ? "修改提示词信息" : "创建一个新的提示词"}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入提示词名称" {...field} />
                  </FormControl>
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
                    <Input placeholder="请输入提示词描述（可选）" {...field} />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingConfigs}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingConfigs ? "加载中..." : "请选择业务配置"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bizConfigs.map((config) => (
                        <SelectItem key={config.id} value={config.id}>
                          {config.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>内容</FormLabel>
                  <FormControl>
                    <Textarea placeholder="请输入提示词内容" className="min-h-[200px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "保存中..." : "保存"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
