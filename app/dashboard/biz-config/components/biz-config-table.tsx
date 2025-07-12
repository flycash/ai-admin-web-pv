"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import type { BizConfig } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

// Mock data for demonstration
const mockBizConfigs: BizConfig[] = [
  {
    id: 1,
    name: "用户偏好配置",
    ownerID: 1001,
    ownerType: "user",
    config: '{"theme": "dark", "language": "zh", "notifications": {"email": true, "push": false}}',
  },
  {
    id: 2,
    name: "组织计费设置",
    ownerID: 2001,
    ownerType: "organization",
    config: '{"billing": {"plan": "premium", "auto_renew": true}, "features": {"analytics": true, "api_access": true}}',
  },
  {
    id: 3,
    name: "用户安全设置",
    ownerID: 1002,
    ownerType: "user",
    config: '{"preferences": {"timezone": "UTC+8", "date_format": "YYYY-MM-DD"}, "security": {"two_factor": true}}',
  },
  {
    id: 4,
    name: "组织 API 限制",
    ownerID: 3001,
    ownerType: "organization",
    config: '{"limits": {"max_requests": 10000, "rate_limit": 100}, "maintenance": {"enabled": false}}',
  },
  {
    id: 5,
    name: "用户界面设置",
    ownerID: 1003,
    ownerType: "user",
    config: '{"ui": {"sidebar_collapsed": false, "show_tooltips": true}, "data": {"export_format": "json"}}',
  },
]

export function BizConfigTable() {
  const { toast } = useToast()
  const [configs, setConfigs] = useState(mockBizConfigs)

  const handleDelete = (id: string) => {
    setConfigs(configs.filter((config) => config.id !== Number.parseInt(id)))
    toast({
      title: "业务配置已删除",
      description: "业务配置已成功删除",
    })
  }

  const getOwnerTypeColor = (ownerType: string) => {
    switch (ownerType) {
      case "user":
        return "default"
      case "organization":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getOwnerTypeText = (ownerType: string) => {
    switch (ownerType) {
      case "user":
        return "用户"
      case "organization":
        return "组织"
      default:
        return ownerType
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名称</TableHead>
            <TableHead>所有者 ID</TableHead>
            <TableHead>所有者类型</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                未找到业务配置。创建您的第一个配置以开始使用。
              </TableCell>
            </TableRow>
          ) : (
            configs.map((config) => (
              <TableRow key={config.id}>
                <TableCell>
                  <div className="font-medium">{config.name}</div>
                  <div className="text-sm text-muted-foreground">ID: {config.id}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{config.ownerID}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={getOwnerTypeColor(config.ownerType)}>{getOwnerTypeText(config.ownerType)}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/biz-config/${config.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">查看</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/biz-config/${config.id}/edit`}>
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">编辑</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">删除</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>删除业务配置</AlertDialogTitle>
                          <AlertDialogDescription>确定要删除此业务配置吗？此操作无法撤销。</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(config.id.toString())}>删除</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
