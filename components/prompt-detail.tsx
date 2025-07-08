"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Edit2, Trash2, CheckCircle, Eye, GitBranch, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { PromptVO, PromptVersionVO } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/lib/i18n/context"

// Mock data - in real app, fetch from API
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

interface PromptDetailProps {
  id: string
}

export function PromptDetail({ id }: PromptDetailProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useI18n()
  const [prompt, setPrompt] = useState<PromptVO | null>(null)
  const [isForking, setIsForking] = useState<number | null>(null)
  const [isPublishing, setIsPublishing] = useState<number | null>(null)

  useEffect(() => {
    // In real app, fetch from API: GET /prompt/:id
    setPrompt(mockPrompt)
  }, [id])

  const handleActivateVersion = (versionId: number) => {
    if (prompt) {
      setPrompt({
        ...prompt,
        active_version: versionId,
      })
      toast({
        title: t("notifications.versionActivated"),
        description: t("notifications.versionActivatedDesc").replace(
          "{label}",
          prompt.versions.find((v) => v.id === versionId)?.label || "",
        ),
      })
    }
  }

  const handleDeleteVersion = (versionId: number) => {
    if (prompt) {
      const updatedVersions = prompt.versions.filter((v) => v.id !== versionId)
      setPrompt({
        ...prompt,
        versions: updatedVersions,
      })
      toast({
        title: t("common.delete"),
        description: t("notifications.versionUpdatedDesc"),
      })
    }
  }

  const handleForkVersion = async (version: PromptVersionVO) => {
    if (!prompt) return

    setIsForking(version.id)

    try {
      // In a real app, call API to fork version: POST /prompt/fork
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Generate a new version ID (in real app, this would come from the API)
      const newVersionId = Math.max(...prompt.versions.map((v) => v.id)) + 1

      // Create a new version based on the forked one
      const newVersion: PromptVersionVO = {
        ...version,
        id: newVersionId,
        label: `${version.label}-fork`,
        status: 0, // Set as draft
        ctime: Date.now(),
        utime: Date.now(),
      }

      // Update the prompt with the new version
      setPrompt({
        ...prompt,
        versions: [...prompt.versions, newVersion],
        update_time: Date.now(),
      })

      toast({
        title: t("notifications.versionForked"),
        description: t("notifications.versionForkedDesc").replace("{label}", newVersion.label),
      })
    } catch (error) {
      console.error("Error forking version:", error)
      toast({
        title: t("notifications.forkFailed"),
        description: t("notifications.forkFailedDesc"),
        variant: "destructive",
      })
    } finally {
      setIsForking(null)
    }
  }

  const handlePublishVersion = async (version: PromptVersionVO) => {
    if (!prompt) return

    setIsPublishing(version.id)

    try {
      // In a real app, call API to publish version: POST /prompt/publish
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the version status to published
      const updatedVersions = prompt.versions.map((v) =>
        v.id === version.id ? { ...v, status: 1, utime: Date.now() } : v,
      )

      setPrompt({
        ...prompt,
        versions: updatedVersions,
        update_time: Date.now(),
      })

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
      setIsPublishing(null)
    }
  }

  if (!prompt) {
    return <div>{t("common.loading")}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{prompt.name}</h1>
          <p className="text-muted-foreground">{prompt.description}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/dashboard/prompts/${prompt.id}/versions/new`}>
              <Plus className="mr-2 h-4 w-4" />
              {t("version.newVersion")}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/prompts/${prompt.id}/edit`}>
              <Edit2 className="mr-2 h-4 w-4" />
              {t("common.edit")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("common.version") + "s"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prompt.versions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("common.active") + " " + t("common.version")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prompt.versions.find((v) => v.id === prompt.active_version)?.label || "None"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("prompt.publishedVersions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prompt.versions.filter((v) => v.status === 1).length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("prompt.versionHistory")}</CardTitle>
          <CardDescription>{t("prompt.allVersions")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.version")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead>{t("common.created")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prompt.versions.map((version) => (
                <TableRow key={version.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {version.id === prompt.active_version && <CheckCircle className="h-4 w-4 text-green-500" />}
                      <span className="font-medium">{version.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={version.status === 1 ? "default" : "secondary"}>
                      {version.status === 1 ? t("common.published") : t("common.draft")}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(version.ctime).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/prompts/${prompt.id}/versions/${version.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">{t("common.view")}</span>
                        </Link>
                      </Button>

                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/prompts/${prompt.id}/versions/${version.id}/edit`}>
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">{t("common.edit")}</span>
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleForkVersion(version)}
                        disabled={isForking !== null || isPublishing !== null}
                      >
                        <GitBranch className={`h-4 w-4 ${isForking === version.id ? "animate-spin" : ""}`} />
                        <span className="sr-only">{t("common.fork")}</span>
                      </Button>

                      {version.status === 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePublishVersion(version)}
                          disabled={isPublishing !== null || isForking !== null}
                        >
                          <Upload className={`h-4 w-4 ${isPublishing === version.id ? "animate-pulse" : ""}`} />
                          <span className="sr-only">{t("common.publish")}</span>
                        </Button>
                      )}

                      {version.id !== prompt.active_version && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleActivateVersion(version.id)}
                          disabled={isPublishing !== null || isForking !== null}
                        >
                          {t("common.activate")}
                        </Button>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={prompt.versions.length === 1 || isPublishing !== null || isForking !== null}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{t("common.delete")}</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("common.delete")}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("prompt.deleteVersionConfirm").replace("{label}", version.label)}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteVersion(version.id)}>
                              {t("common.delete")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
