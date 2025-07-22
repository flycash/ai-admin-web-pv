"use client"

import { use } from "react"
import { ConfigVersionForm } from "../../../components/config-version-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewConfigVersionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/invocation-config/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">新建配置版本</h1>
          <p className="text-muted-foreground">为调用配置创建新版本</p>
        </div>
      </div>
      <ConfigVersionForm invocationConfigId={Number.parseInt(id)} />
    </div>
  )
}
