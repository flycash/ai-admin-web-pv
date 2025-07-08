import { PromptForm } from "@/components/prompt-form"

export default function NewPromptPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">创建新提示词</h1>
        <p className="text-muted-foreground">为您的 AI 模型配置新的提示词</p>
      </div>
      <PromptForm />
    </div>
  )
}
