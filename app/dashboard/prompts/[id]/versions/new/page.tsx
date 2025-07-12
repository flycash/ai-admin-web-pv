import { VersionForm } from "@/components/version-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface NewVersionPageProps {
  params: {
    id: string
  }
}

export default function NewVersionPage({ params }: NewVersionPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/prompts/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">创建新版本</h1>
          <p className="text-muted-foreground">为此提示词创建新版本</p>
        </div>
      </div>
      <VersionForm promptId={params.id} />
    </div>
  )
}
