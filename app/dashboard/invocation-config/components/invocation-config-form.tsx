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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"
import { http } from "@/lib/http"
import { useToast } from "@/hooks/use-toast"
import type { InvocationConfig } from "@/lib/types/invocation_config"
import type { BizConfig } from "@/lib/types/biz_config"
import {DataList, Result} from "@/lib/types/result";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "配置名称至少需要2个字符。",
  }),
  description: z.string().optional(),
  bizID: z.number().min(1, {
    message: "请选择业务配置。",
  }),
})

type FormData = z.infer<typeof formSchema>

interface InvocationConfigFormProps {
  id?: number
}

export function InvocationConfigForm({ id }: InvocationConfigFormProps) {
  const [bizConfigs, setBizConfigs] = useState<BizConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingBizConfigs, setLoadingBizConfigs] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      bizID: 0,
    },
  })

  const fetchBizConfigs = async () => {
    try {
      setLoadingBizConfigs(true)
      const resp = await http.post<Result<DataList<BizConfig>>>("/biz-configs/list", {offset: 0, limit: 1000})
      const result = resp.data
      if (result.code === 0) {
        setBizConfigs(result.data.list || [])
      } else {
        toast({
          title: "获取业务配置失败",
          description: result.msg || "请稍后重试",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("获取业务配置失败:", error)
      toast({
        title: "获取业务配置失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoadingBizConfigs(false)
    }
  }

  const getDetail = async () => {
    try {
      const resp = await http.post<Result<InvocationConfig>>("/invocation-configs/basic", {id: id})
      const result = resp.data
      if (result.code === 0) {
        const cfg = result?.data || {} as InvocationConfig
        form.reset(cfg)
      } else {
        toast({
          title: "获取调用配置失败",
          description: result.msg || "请稍后重试",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("获取调用配置失败:", error)
      toast({
        title: "获取调用配置失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  // 获取业务配置列表
  useEffect(() => {
    fetchBizConfigs()
    getDetail()
  }, [toast])

  const onSubmit = async (values: FormData) => {
    setLoading(true)

    try {
      const cfg = {
        id: id,
        name: values.name.trim(),
        description: values.description?.trim() || "",
        bizID: values.bizID,
      }

      const resp = await http.post<Result<number>>("/invocation-configs/save", { cfg })
      const result = resp.data

      if (result.code === 0) {
        toast({
          title: "保存成功",
          description: "调用配置保存成功",
        })
        router.push("/dashboard/invocation-config")
      } else {
        toast({
          title: "保存失败",
          description: result.msg || "保存调用配置失败",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("保存调用配置失败:", error)
      toast({
        title: "保存失败",
        description: "保存调用配置失败",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{id ? "编辑调用配置" : "创建调用配置"}</CardTitle>
        <CardDescription>{id ? "修改调用配置信息" : "创建新的调用配置"}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>配置名称 *</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入配置名称" disabled={loading} {...field} />
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
                    <Textarea placeholder="请输入配置描述" rows={3} disabled={loading} {...field} />
                  </FormControl>
                  <FormDescription>详细描述此调用配置的用途和功能。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bizID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>业务配置 *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                    value={field.value.toString()}
                    disabled={loading || loadingBizConfigs}
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

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                取消
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    保存
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
