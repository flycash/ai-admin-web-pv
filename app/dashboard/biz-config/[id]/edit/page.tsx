"use client"

import { BizConfigForm } from "../../components/biz-config-form"

interface EditBizConfigPageProps {
  params: {
    id: string
  }
}

export default function EditBizConfigPage({ params }: EditBizConfigPageProps) {
  return <BizConfigForm id={params.id} />
}
