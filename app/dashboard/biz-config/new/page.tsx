"use client"

import { BizConfigForm } from "@/components/biz-config-form"

export default function NewBizConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">创建业务配置</h1>
        <p className="text-muted-foreground">为所有者配置业务设置</p>
      </div>
      <BizConfigForm />
    </div>
  )
}
