import { InvocationConfigDetail } from "../components/invocation-config-detail"

interface InvocationConfigDetailPageProps {
  params: {
    id: string
  }
}

export default function InvocationConfigDetailPage({ params }: InvocationConfigDetailPageProps) {
  return <InvocationConfigDetail id={params.id} />
}
