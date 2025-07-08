import { VersionForm } from "@/components/version-form"

interface NewVersionPageProps {
  params: {
    id: string
  }
}

export default function NewVersionPage({ params }: NewVersionPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Version</h1>
        <p className="text-muted-foreground">Create a new version for this prompt</p>
      </div>
      <VersionForm promptId={params.id} />
    </div>
  )
}
