"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { ModelProviderTable } from "./components/model-provider-table"

export default function ProvidersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">模型服务商</h1>
          <p className="text-muted-foreground">管理AI模型服务商配置</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/provider/new">
            <Plus className="mr-2 h-4 w-4" />
            新增服务商
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>服务商列表</CardTitle>
        </CardHeader>
        <CardContent>
          <ModelProviderTable/>
        </CardContent>
      </Card>
    </div>
  )
}
