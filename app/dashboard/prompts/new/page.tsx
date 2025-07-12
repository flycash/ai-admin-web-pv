import { PromptForm } from "@/components/prompt-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewPromptPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/prompts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">创建新提示词</h1>
          <p className="text-muted-foreground">为您的 AI 模型配置新的提示词</p>
        </div>
      </div>
      <PromptForm />
    </div>
  )
}
