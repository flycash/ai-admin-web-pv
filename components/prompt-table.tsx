"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Eye } from "lucide-react"
import Link from "next/link"
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
import { Badge } from "@/components/ui/badge"
import type { PromptVO } from "@/lib/types"

// Mock data for demonstration - now using PromptVO structure
const mockPrompts: PromptVO[] = [
  {
    id: 1,
    name: "文本摘要",
    owner: 1,
    owner_type: "user",
    active_version: 2,
    description: "用于将长文本总结为简洁要点的提示词",
    versions: [
      {
        id: 1,
        label: "v1.0",
        content: "总结以下文本：\n\n{{text}}",
        system_content: "你是一个专门从事文本摘要的有用助手。",
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
        content: "用要点形式总结以下文本：\n\n{{text}}",
        system_content: "你是一个专门从事文本摘要的有用助手。",
        temperature: 0.7,
        top_n: 0.9,
        max_tokens: 500,
        status: 1,
        ctime: 1684224000000,
        utime: 1684224000000,
      },
    ],
    create_time: 1684137600000,
    update_time: 1684224000000,
  },
  {
    id: 2,
    name: "代码生成",
    owner: 1,
    owner_type: "user",
    active_version: 3,
    description: "根据需求生成代码",
    versions: [
      {
        id: 3,
        label: "v1.0",
        content: "编写 {{language}} 代码来解决以下问题：\n\n{{problem}}",
        system_content: "你是一个编写干净、高效代码的专家程序员。",
        temperature: 0.2,
        top_n: 1.0,
        max_tokens: 1000,
        status: 1,
        ctime: 1687516800000,
        utime: 1687516800000,
      },
    ],
    create_time: 1687516800000,
    update_time: 1687516800000,
  },
]

export function PromptTable() {
  const [prompts, setPrompts] = useState(mockPrompts)

  const handleDelete = (id: string) => {
    setPrompts(prompts.filter((prompt) => prompt.id !== Number.parseInt(id)))
  }

  const getActiveVersion = (prompt: PromptVO) => {
    return prompt.versions.find((v) => v.id === prompt.active_version)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名称</TableHead>
            <TableHead>活跃版本</TableHead>
            <TableHead>版本数</TableHead>
            <TableHead>更新时间</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prompts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                未找到提示词。创建您的第一个提示词以开始使用。
              </TableCell>
            </TableRow>
          ) : (
            prompts.map((prompt) => {
              const activeVersion = getActiveVersion(prompt)
              return (
                <TableRow key={prompt.id}>
                  <TableCell>
                    <div className="font-medium">{prompt.name}</div>
                    <div className="text-sm text-muted-foreground">{prompt.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={activeVersion?.status === 1 ? "default" : "secondary"}>
                      {activeVersion?.label || "无活跃版本"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{prompt.versions.length}</span>
                  </TableCell>
                  <TableCell>{new Date(prompt.update_time).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/prompts/${prompt.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">查看</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/prompts/${prompt.id}/edit`}>
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">编辑</span>
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">删除</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>删除提示词</AlertDialogTitle>
                            <AlertDialogDescription>确定要删除此提示词吗？此操作无法撤销。</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(prompt.id.toString())}>
                              删除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
