"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Edit2, Trash2, Eye, Loader2 } from "lucide-react"
import { configVersionApi, type PaginatedResponse } from "@/lib/api"
import { toast } from "sonner"
import type { ConfigVersion } from "@/lib/types/llm_invocation"

interface ConfigVersionTableProps {
  configId: string
  onVersionChange?: () => void
}

export function ConfigVersionTable({ configId, onVersionChange }: ConfigVersionTableProps) {
  const [versions, setVersions] = useState<ConfigVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  })

  // 获取版本列表
  const fetchVersions = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true)
      const result = await configVersionApi.getList(configId, { page, pageSize })

      if (result.code === 0) {
        const data = result.data as PaginatedResponse<ConfigVersion>
        setVersions(data.data)
        setPagination({
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          totalPages: data.totalPages,
        })
      } else {
        toast.error(result.msg || "获取版本列表失败")
      }
    } catch (error) {
      console.error("获取版本列表失败:", error)
      toast.error("获取版本列表失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  // 切换版本状态
  const handleToggleStatus = async (versionId: string, currentStatus: string) => {
    try {
      setToggling(versionId)
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      const result = await configVersionApi.toggleStatus(configId, versionId, newStatus)

      if (result.code === 0) {
        toast.success(`版本状态已${newStatus === "ACTIVE" ? "激活" : "停用"}`)
        await fetchVersions(pagination.page, pagination.pageSize)
        onVersionChange?.()
      } else {
        toast.error(result.msg || "切换版本状态失败")
      }
    } catch (error) {
      console.error("切换版本状态失败:", error)
      toast.error("切换版本状态失败，请稍后重试")
    } finally {
      setToggling(null)
    }
  }

  // 删除版本
  const handleDelete = async (versionId: string) => {
    try {
      setDeleting(versionId)
      const result = await configVersionApi.delete(configId, versionId)

      if (result.code === 0) {
        toast.success("版本删除成功")
        // 如果当前页没有数据了，回到上一页
        if (versions.length === 1 && pagination.page > 1) {
          await fetchVersions(pagination.page - 1, pagination.pageSize)
        } else {
          await fetchVersions(pagination.page, pagination.pageSize)
        }
        onVersionChange?.()
      } else {
        toast.error(result.msg || "删除版本失败")
      }
    } catch (error) {
      console.error("删除版本失败:", error)
      toast.error("删除版本失败，请稍后重试")
    } finally {
      setDeleting(null)
    }
  }

  // 页面变化处理
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchVersions(page, pagination.pageSize)
    }
  }

  // 初始化加载
  useEffect(() => {
    fetchVersions()
  }, [configId])

  // 格式化时间
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("zh-CN")
  }

  // 生成分页项
  const generatePaginationItems = () => {
    const items = []
    const { page, totalPages } = pagination

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => handlePageChange(i)} isActive={page === i} className="cursor-pointer">
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    } else {
      // 复杂分页逻辑
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)} isActive={page === 1} className="cursor-pointer">
            1
          </PaginationLink>
        </PaginationItem>,
      )

      if (page > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => handlePageChange(i)} isActive={page === i} className="cursor-pointer">
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }

      if (page < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={page === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    }

    return items
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>版本号</TableHead>
                <TableHead>模型</TableHead>
                <TableHead>温度</TableHead>
                <TableHead>TopN</TableHead>
                <TableHead>最大令牌</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: pagination.pageSize }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>版本号</TableHead>
              <TableHead>模型</TableHead>
              <TableHead>温度</TableHead>
              <TableHead>TopN</TableHead>
              <TableHead>最大令牌</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  暂无版本。创建第一个版本以开始使用。
                </TableCell>
              </TableRow>
            ) : (
              versions.map((version) => (
                <TableRow key={version.id}>
                  <TableCell>
                    <Badge variant="outline">v{version.version}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{version.model}</span>
                  </TableCell>
                  <TableCell>{version.temperature}</TableCell>
                  <TableCell>{version.topN}</TableCell>
                  <TableCell>{version.maxTokens}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={version.status === "ACTIVE"}
                        onCheckedChange={() => handleToggleStatus(version.id.toString(), version.status)}
                        disabled={toggling === version.id.toString()}
                      />
                      <Badge variant={version.status === "ACTIVE" ? "default" : "secondary"}>
                        {version.status === "ACTIVE" ? "活跃" : "停用"}
                      </Badge>
                      {toggling === version.id.toString() && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(version.ctime)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/invocation-config/${configId}/versions/${version.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">查看</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/invocation-config/${configId}/versions/${version.id}/edit`}>
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">编辑</span>
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={deleting === version.id.toString()}>
                            {deleting === version.id.toString() ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">删除</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>删除版本</AlertDialogTitle>
                            <AlertDialogDescription>
                              确定要删除版本 v{version.version} 吗？此操作无法撤销。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(version.id.toString())}
                              disabled={deleting === version.id.toString()}
                            >
                              {deleting === version.id.toString() ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  删除中...
                                </>
                              ) : (
                                "删除"
                              )}
                            </AlertDialogAction>
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

      {/* 分页组件 */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            显示第 {(pagination.page - 1) * pagination.pageSize + 1} -{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} 条，共 {pagination.total} 条
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className={pagination.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {generatePaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className={
                    pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
