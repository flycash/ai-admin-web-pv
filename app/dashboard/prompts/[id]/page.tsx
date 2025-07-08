import { PromptDetail } from "@/components/prompt-detail"

interface PromptDetailPageProps {
  params: {
    id: string
  }
}

export default function PromptDetailPage({ params }: PromptDetailPageProps) {
  return <PromptDetail id={params.id} />
}
