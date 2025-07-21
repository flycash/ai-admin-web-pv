import { InvocationConfigForm } from "../../components/invocation-config-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditInvocationConfigPageProps {
  params: {
    id: string
  }
}

export default function EditInvocationConfigPage({ params }: EditInvocationConfigPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/invocation-config/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">编辑调用配置</h1>
          <p className="text-muted-foreground">修改调用配置信息</p>
        </div>
      </div>
      <InvocationConfigForm id={params.id} />
    </div>
  )
}
