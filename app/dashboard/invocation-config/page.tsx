"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { InvocationConfigTable } from "./components/invocation-config-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function InvocationConfigPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">调用配置管理</h1>
          <p className="text-muted-foreground">管理您的 AI 调用配置和版本</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/invocation-config/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            新建调用配置
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>所有调用配置</CardTitle>
          <CardDescription>管理您的调用配置</CardDescription>
        </CardHeader>
        <CardContent>
          <InvocationConfigTable />
        </CardContent>
      </Card>
    </div>
  )
}
