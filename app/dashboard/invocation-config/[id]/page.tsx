import { InvocationConfigDetail } from "../components/invocation-config-detail"
import {use} from "react";

export default function InvocationConfigDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = use(params)
  return <InvocationConfigDetail id={parseInt(id)} />
}
