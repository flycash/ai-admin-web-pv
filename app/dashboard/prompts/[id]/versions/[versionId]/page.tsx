import { VersionDetail } from "@/components/version-detail"

interface VersionDetailPageProps {
  params: {
    id: string
    versionId: string
  }
}

export default function VersionDetailPage({ params }: VersionDetailPageProps) {
  return <VersionDetail promptId={params.id} versionId={params.versionId} />
}
