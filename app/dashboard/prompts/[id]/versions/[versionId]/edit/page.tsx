import { VersionForm } from "@/components/version-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditVersionPageProps {
  params: {
    id: string
    versionId: string
  }
}

export default function EditVersionPage({ params }: EditVersionPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/prompts/${params.id}/versions/${params.versionId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">编辑版本</h1>
          <p className="text-muted-foreground">更新此提示词版本</p>
        </div>
      </div>
      <VersionForm promptId={params.id} versionId={params.versionId} />
    </div>
  )
}
