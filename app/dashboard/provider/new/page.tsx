import { ModelProviderForm } from "../components/model-provider-form"

export default function NewProviderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">新增服务商</h1>
        <p className="text-muted-foreground">创建新的AI模型服务商配置</p>
      </div>

      <ModelProviderForm />
    </div>
  )
}
