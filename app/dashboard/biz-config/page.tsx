"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { BizConfigTable } from "@/components/biz-config-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BizConfigPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">业务配置管理</h1>
          <p className="text-muted-foreground">管理不同所有者的业务配置</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/biz-config/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            新建业务配置
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>所有配置</CardTitle>
          <CardDescription>管理业务配置</CardDescription>
        </CardHeader>
        <CardContent>
          <BizConfigTable />
        </CardContent>
      </Card>
    </div>
  )
}
