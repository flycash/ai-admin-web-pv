"use client"

import { BizConfigForm } from "../../components/biz-config-form"
import {use} from "react";

export default function EditBizConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = use(params)
  return <BizConfigForm id={parseInt(id)} />
}
