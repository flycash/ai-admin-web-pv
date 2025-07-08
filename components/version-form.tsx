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
import { ArrowLeft, Upload } from "lucide-react"
import type { PromptVersionVO } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/lib/i18n/context"

const formSchema = z.object({
  label: z.string().min(2, {
    message: "Label must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  system_content: z.string().min(5, {
    message: "System content must be at least 5 characters.",
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
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

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
      const mockVersion: PromptVersionVO = {
        id: Number.parseInt(versionId),
        label: "v1.1",
        content: "Summarize the following text in bullet points:\n\n{{text}}",
        system_content: "You are a helpful assistant that specializes in text summarization.",
        temperature: 0.7,
        top_n: 0.9,
        max_tokens: 500,
        status: 1,
        ctime: 1684224000000,
        utime: 1684224000000,
      }
      form.reset(mockVersion)
    }
  }, [versionId, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      if (versionId) {
        console.log("Updating version:", { id: Number.parseInt(versionId), ...values })
        toast({
          title: t("notifications.versionUpdated"),
          description: t("notifications.versionUpdatedDesc"),
        })
      } else {
        console.log("Creating version:", { prompt_id: Number.parseInt(promptId), ...values })
        toast({
          title: t("notifications.versionCreated"),
          description: t("notifications.versionCreatedDesc"),
        })
      }

      router.push(`/dashboard/prompts/${promptId}`)
    } catch (error) {
      console.error("Error saving version:", error)
      toast({
        title: t("notifications.saveFailed"),
        description: t("notifications.saveFailedDesc"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onSaveAndPublish(values: z.infer<typeof formSchema>) {
    setIsPublishing(true)

    try {
      if (versionId) {
        console.log("Updating version:", { id: Number.parseInt(versionId), ...values })
      } else {
        console.log("Creating version:", { prompt_id: Number.parseInt(promptId), ...values })
      }

      console.log("Publishing version")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: t("notifications.versionSavedPublished"),
        description: t("notifications.versionSavedPublishedDesc"),
      })

      router.push(`/dashboard/prompts/${promptId}`)
    } catch (error) {
      console.error("Error saving and publishing version:", error)
      toast({
        title: t("notifications.saveFailed"),
        description: t("notifications.saveFailedDesc"),
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("version.versionInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("version.versionLabel")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("placeholders.versionLabel")} {...field} />
                      </FormControl>
                      <FormDescription>{t("descriptions.versionLabel")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("common.status")}</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number.parseInt(value))}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">{t("common.published")}</SelectItem>
                          <SelectItem value="0">{t("common.draft")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>{t("descriptions.versionStatus")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("version.modelParams")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("version.temperature")}: {field.value}
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={1}
                          step={0.01}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>{t("descriptions.temperature")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="top_n"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("version.topN")}: {field.value}
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={1}
                          step={0.01}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>{t("descriptions.topN")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="max_tokens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("version.maxTokens")}: {field.value}
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={4000}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>{t("descriptions.maxTokens")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("version.systemPrompt")}</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="system_content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("version.systemContent")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("placeholders.systemContent")}
                        className="min-h-[100px] font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{t("descriptions.systemContent")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("version.userPromptTemplate")}</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("version.content")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("placeholders.promptContent")}
                        className="min-h-[200px] font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{t("descriptions.promptContent")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading || isPublishing}>
              {isLoading
                ? t("common.save") + "..."
                : versionId
                  ? t("version.updateVersion")
                  : t("version.createVersion")}
            </Button>
            <Button type="button" onClick={form.handleSubmit(onSaveAndPublish)} disabled={isLoading || isPublishing}>
              <Upload className="mr-2 h-4 w-4" />
              {isPublishing ? t("common.publishing") : t("common.saveAndPublish")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
