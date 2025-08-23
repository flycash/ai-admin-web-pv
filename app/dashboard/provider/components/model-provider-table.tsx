"use client"

import { useEffect, useState} from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import type { ModelProvider } from "@/lib/types/model"
import {http} from "@/lib/http";
import {DataList, Result} from "@/lib/types/result";

interface ModelProviderTableProps {
}

export function ModelProviderTable() {

  const [loading, setLoading] = useState(true)
  const [providers, setProviders] = useState<ModelProvider[]>([])
  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoading(true)
        // TODO 支持分页
        const resp = await http.post<Result<DataList<ModelProvider>>>("/providers/list", {
          offset: 0,
          limit: 100
        })
        const result = resp.data
        setProviders(result.data?.list || [])

      } catch (err) {
      } finally {
        setLoading(false)
      }
    }

    loadProviders()
  }, []);

  const maskApiKey = (apiKey: string) => {
    if (apiKey.length <= 8) return apiKey
    return apiKey.substring(0, 8) + "*".repeat(Math.min(apiKey.length - 8, 15))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded">
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>名称</TableHead>
            <TableHead>API Key</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.map((provider) => (
            <TableRow key={provider.id}>
              <TableCell className="font-mono text-sm">{provider.id}</TableCell>
              <TableCell className="font-medium">{provider.name}</TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">{maskApiKey(provider.apiKey)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/provider/${provider.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/provider/${provider.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
