"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { PromptTable } from "@/components/prompt-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PromptsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">提示词管理</h1>
          <p className="text-muted-foreground">管理您的 AI 提示词和配置</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/prompts/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            新建提示词
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>所有提示词</CardTitle>
          <CardDescription>管理您的提示词</CardDescription>
        </CardHeader>
        <CardContent>
          <PromptTable />
        </CardContent>
      </Card>
    </div>
  )
}
