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
import { ArrowLeft } from "lucide-react"
import type { BizConfig } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "名称至少需要 2 个字符。",
  }),
  ownerID: z.number().min(1, {
    message: "所有者 ID 必须是正数。",
  }),
  ownerType: z.enum(["user", "organization"], {
    required_error: "请选择所有者类型。",
  }),
  config: z
    .string()
    .min(1, {
      message: "配置是必需的。",
    })
    .refine(
      (val) => {
        try {
          JSON.parse(val)
          return true
        } catch {
          return false
        }
      },
      {
        message: "配置必须是有效的 JSON。",
      },
    ),
})

interface BizConfigFormProps {
  id?: string
}

export function BizConfigForm({ id }: BizConfigFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ownerID: 0,
      ownerType: "user",
      config: "",
    },
  })

  useEffect(() => {
    if (id) {
      // In real app, fetch the config data from API: GET /biz-config/:id
      const mockConfig: BizConfig = {
        id: Number.parseInt(id),
        name: "用户偏好配置",
        ownerID: 1001,
        ownerType: "user",
        config:
          '{\n  "theme": "dark",\n  "language": "zh",\n  "notifications": {\n    "email": true,\n    "push": false\n  }\n}',
      }
      form.reset({
        name: mockConfig.name,
        ownerID: mockConfig.ownerID,
        ownerType: mockConfig.ownerType,
        config: mockConfig.config,
      })
    }
  }, [id, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      if (id) {
        // Update existing config: POST /biz-config/update
        console.log("更新配置:", { id: Number.parseInt(id), ...values })
        toast({
          title: "业务配置已更新",
          description: "业务配置已成功更新",
        })
      } else {
        // Create new config: POST /biz-config/add
        console.log("创建配置:", values)
        toast({
          title: "业务配置已创建",
          description: "新业务配置已成功创建",
        })
      }

      router.push("/dashboard/biz-config")
    } catch (error) {
      console.error("保存配置时出错:", error)
      toast({
        title: "保存失败",
        description: "保存版本时出错",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatJson = () => {
    try {
      const config = form.getValues("config")
      const parsed = JSON.parse(config)
      const formatted = JSON.stringify(parsed, null, 2)
      form.setValue("config", formatted)
    } catch (error) {
      // Invalid JSON, don't format
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{id ? "编辑业务配置" : "创建业务配置"}</h1>
          <p className="text-muted-foreground">{id ? "更新业务配置设置" : "为所有者配置业务设置"}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>配置名称</FormLabel>
                    <FormControl>
                      <Input placeholder="我的配置" {...field} />
                    </FormControl>
                    <FormDescription>此配置的描述性名称。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>所有者信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="ownerID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>所有者 ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="输入所有者 ID"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>配置所有者的唯一标识符。</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ownerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>所有者类型</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择所有者类型" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">用户</SelectItem>
                          <SelectItem value="organization">组织</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>所有者的类型（用户或组织）。</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>配置数据</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="config"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>配置 JSON</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{\n  "key": "value",\n  "setting": "example"\n}'
                        className="min-h-[300px] font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      业务逻辑的 JSON 配置数据。
                      <Button type="button" variant="link" className="p-0 h-auto ml-2" onClick={formatJson}>
                        格式化 JSON
                      </Button>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/biz-config")}>
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : id ? "更新业务配置" : "创建业务配置"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
