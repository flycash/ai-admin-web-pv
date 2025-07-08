"use client"

import { BizConfigForm } from "@/components/biz-config-form"

interface EditBizConfigPageProps {
  params: {
    id: string
  }
}

export default function EditBizConfigPage({ params }: EditBizConfigPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">编辑业务配置</h1>
        <p className="text-muted-foreground">更新业务配置设置</p>
      </div>
      <BizConfigForm id={params.id} />
    </div>
  )
}
