import { BizConfigDetail } from "@/components/biz-config-detail"

interface BizConfigDetailPageProps {
  params: {
    id: string
  }
}

export default function BizConfigDetailPage({ params }: BizConfigDetailPageProps) {
  return <BizConfigDetail id={params.id} />
}
