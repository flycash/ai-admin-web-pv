"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ModelForm } from "../components/model-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function NewModelContent() {
  const searchParams = useSearchParams()
  const providerId = searchParams.get("pid") ? Number(searchParams.get("pid")) : undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={providerId ? `/dashboard/provider/${providerId}` : "/dashboard/model"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">创建模型</h1>
          <p className="text-muted-foreground">添加新的AI模型</p>
        </div>
      </div>

      <ModelForm providerId={providerId} />
    </div>
  )
}

export default function NewModelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewModelContent />
    </Suspense>
  )
}
