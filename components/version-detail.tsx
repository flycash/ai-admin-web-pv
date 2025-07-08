"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit2, Copy, GitBranch, CheckCircle, Upload } from "lucide-react"
import Link from "next/link"
import type { PromptVersionVO, PromptVO } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/lib/i18n/context"

// Mock data for demonstration
const mockPrompt: PromptVO = {
  id: 1,
  name: "Text Summarization",
  owner: 1,
  owner_type: "user",
  active_version: 2,
  description: "A prompt for summarizing long text into concise points",
  versions: [
    {
      id: 1,
      label: "v1.0",
      content: "Summarize the following text:\n\n{{text}}",
      system_content: "You are a helpful assistant that specializes in text summarization.",
      temperature: 0.7,
      top_n: 0.9,
      max_tokens: 500,
      status: 0,
      ctime: 1684137600000,
      utime: 1684137600000,
    },
    {
      id: 2,
      label: "v1.1",
      content: "Summarize the following text in bullet points:\n\n{{text}}",
      system_content: "You are a helpful assistant that specializes in text summarization.",
      temperature: 0.7,
      top_n: 0.9,
      max_tokens: 500,
      status: 1,
      ctime: 1684224000000,
      utime: 1684224000000,
    },
    {
      id: 3,
      label: "v1.2-draft",
      content: "Please provide a comprehensive summary of the following text in bullet points:\n\n{{text}}",
      system_content: "You are a helpful assistant that specializes in text summarization. Focus on key points.",
      temperature: 0.6,
      top_n: 0.85,
      max_tokens: 600,
      status: 0,
      ctime: 1684310400000,
      utime: 1684310400000,
    },
  ],
  create_time: 1684137600000,
  update_time: 1684310400000,
}

interface VersionDetailProps {
  promptId: string
  versionId: string
}

export function VersionDetail({ promptId, versionId }: VersionDetailProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useI18n()
  const [prompt, setPrompt] = useState<PromptVO | null>(null)
  const [version, setVersion] = useState<PromptVersionVO | null>(null)
  const [isActivating, setIsActivating] = useState(false)
  const [isForking, setIsForking] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    // In real app, fetch from API
    setPrompt(mockPrompt)
    const foundVersion = mockPrompt.versions.find((v) => v.id === Number.parseInt(versionId))
    setVersion(foundVersion || null)
  }, [promptId, versionId])

  const handleActivateVersion = async () => {
    if (!version) return

    setIsActivating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (prompt) {
        setPrompt({
          ...prompt,
          active_version: version.id,
        })
      }

      toast({
        title: t("notifications.versionActivated"),
        description: t("notifications.versionActivatedDesc").replace("{label}", version.label),
      })
    } catch (error) {
      console.error("Error activating version:", error)
    } finally {
      setIsActivating(false)
    }
  }

  const handleForkVersion = async () => {
    if (!version || !prompt) return

    setIsForking(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newVersionId = Math.max(...prompt.versions.map((v) => v.id)) + 1
      const newVersion: PromptVersionVO = {
        ...version,
        id: newVersionId,
        label: `${version.label}-fork`,
        status: 0,
        ctime: Date.now(),
        utime: Date.now(),
      }

      toast({
        title: t("notifications.versionForked"),
        description: t("notifications.versionForkedDesc").replace("{label}", newVersion.label),
      })

      router.push(`/dashboard/prompts/${promptId}/versions/${newVersionId}`)
    } catch (error) {
      console.error("Error forking version:", error)
      toast({
        title: t("notifications.forkFailed"),
        description: t("notifications.forkFailedDesc"),
        variant: "destructive",
      })
    } finally {
      setIsForking(false)
    }
  }

  const handlePublishVersion = async () => {
    if (!version) return

    setIsPublishing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedVersion = { ...version, status: 1, utime: Date.now() }
      setVersion(updatedVersion)

      toast({
        title: t("notifications.versionPublished"),
        description: t("notifications.versionPublishedDesc").replace("{label}", version.label),
      })
    } catch (error) {
      console.error("Error publishing version:", error)
      toast({
        title: t("notifications.publishFailed"),
        description: t("notifications.publishFailedDesc"),
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleCopyContent = () => {
    if (!version) return
    navigator.clipboard.writeText(version.content)
    toast({
      title: t("notifications.contentCopied"),
      description: t("notifications.contentCopiedDesc"),
    })
  }

  if (!version || !prompt) {
    return <div>{t("common.loading")}</div>
  }

  const isActive = prompt.active_version === version.id
  const isPublished = version.status === 1

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/prompts/${promptId}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{version.label}</h1>
            {isActive && (
              <Badge className="ml-2" variant="default">
                <CheckCircle className="mr-1 h-3 w-3" /> {t("common.active")}
              </Badge>
            )}
            <Badge variant={isPublished ? "default" : "secondary"}>
              {isPublished ? t("common.published") : t("common.draft")}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {t("version.versionFor")} <span className="font-medium">{prompt.name}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleForkVersion} disabled={isForking || isPublishing}>
            <GitBranch className={`mr-2 h-4 w-4 ${isForking ? "animate-spin" : ""}`} />
            {isForking ? t("common.forking") : t("common.fork")}
          </Button>

          {!isPublished && (
            <Button onClick={handlePublishVersion} disabled={isPublishing || isForking}>
              <Upload className={`mr-2 h-4 w-4 ${isPublishing ? "animate-pulse" : ""}`} />
              {isPublishing ? t("common.publishing") : t("common.publish")}
            </Button>
          )}

          {!isActive && isPublished && (
            <Button onClick={handleActivateVersion} disabled={isActivating || isPublishing || isForking}>
              {isActivating ? t("common.activating") : t("common.activate")}
            </Button>
          )}

          <Button variant="outline" asChild>
            <Link href={`/dashboard/prompts/${promptId}/versions/${versionId}/edit`}>
              <Edit2 className="mr-2 h-4 w-4" />
              {t("common.edit")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("version.versionInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t("common.status")}</div>
                <Badge variant={version.status === 1 ? "default" : "secondary"}>
                  {version.status === 1 ? t("common.published") : t("common.draft")}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t("common.created")}</div>
                <div>{new Date(version.ctime).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t("common.updated")}</div>
                <div>{new Date(version.utime).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t("version.versionId")}</div>
                <div>{version.id}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("version.modelParams")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t("version.temperature")}</div>
                <div className="text-xl font-medium">{version.temperature}</div>
                <div className="text-xs text-muted-foreground">
                  {version.temperature < 0.3
                    ? t("version.moreDeterministic")
                    : version.temperature > 0.7
                      ? t("version.moreCreative")
                      : t("version.balanced")}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t("version.topN")}</div>
                <div className="text-xl font-medium">{version.top_n}</div>
                <div className="text-xs text-muted-foreground">
                  {version.top_n < 0.5
                    ? t("version.moreFocused")
                    : version.top_n > 0.8
                      ? t("version.moreDiverse")
                      : t("version.balanced")}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t("version.maxTokens")}</div>
                <div className="text-xl font-medium">{version.max_tokens}</div>
                <div className="text-xs text-muted-foreground">
                  {version.max_tokens < 500
                    ? t("version.shortResponses")
                    : version.max_tokens > 1000
                      ? t("version.longResponses")
                      : t("version.mediumResponses")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("version.systemContent")}</CardTitle>
          <CardDescription>System instructions for the AI model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap">{version.system_content}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("version.promptContent")}</CardTitle>
          <CardDescription>Template with variables in double curly braces</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap">{version.content}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyContent}>
              <Copy className="mr-2 h-4 w-4" />
              {t("common.copy")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
