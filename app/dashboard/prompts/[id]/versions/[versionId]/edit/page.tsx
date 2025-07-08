import { VersionForm } from "@/components/version-form"

interface EditVersionPageProps {
  params: {
    id: string
    versionId: string
  }
}

export default function EditVersionPage({ params }: EditVersionPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Version</h1>
        <p className="text-muted-foreground">Update this prompt version</p>
      </div>
      <VersionForm promptId={params.id} versionId={params.versionId} />
    </div>
  )
}
