"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Eye, Loader2 } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { invocationConfigApi, type PaginatedResponse } from "@/lib/api"
import { toast } from "sonner"
import type { InvocationConfig } from "@/lib/types/llm_invocation"

export function InvocationConfigTable() {
  const [configs, setConfigs] = useState<InvocationConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  })

  // 获取调用配置列表
  const fetchConfigs = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true)
      const result = await invocationConfigApi.getList({ page, pageSize })

      if (result.code === 0) {
        const data = result.data as PaginatedResponse<InvocationConfig>
        setConfigs(data.data)
        setPagination({
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          totalPages: data.totalPages,
        })
      } else {
        toast.error(result.msg || "获取调用配置列表失败")
      }
    } catch (error) {
      console.error("获取调用配置列表失败:", error)
      toast.error("获取调用配置列表失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  // 删除调用配置
  const handleDelete = async (id: string, name: string) => {
    try {
      setDeleting(id)
      const result = await invocationConfigApi.delete(id)

      if (result.code === 0) {
        toast.success(`调用配置 "${name}" 删除成功`)
        // 如果当前页没有数据了，回到上一页
        if (configs.length === 1 && pagination.page > 1) {
          await fetchConfigs(pagination.page - 1, pagination.pageSize)
        } else {
          await fetchConfigs(pagination.page, pagination.pageSize)
        }
      } else {
        toast.error(result.msg || "删除调用配置失败")
      }
    } catch (error) {
      console.error("删除调用配置失败:", error)
      toast.error("删除调用配置失败，请稍后重试")
    } finally {
      setDeleting(null)
    }
  }

  // 页面变化处理
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchConfigs(page, pagination.pageSize)
    }
  }

  // 初始化加载
  useEffect(() => {
    fetchConfigs()
  }, [])

  // 生成分页项
  const generatePaginationItems = () => {
    const items = []
    const { page, totalPages } = pagination

    if (totalPages <= 7) {
      // 如果总页数小于等于7，显示所有页码
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
      // 始终显示第一页
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

      // 显示当前页附近的页码
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

      // 始终显示最后一页
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

  // 格式化时间
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("zh-CN")
  }

  // 获取活跃版本数量
  const getActiveVersionsCount = (config: InvocationConfig) => {
    return config.versions?.filter((v) => v.status === "ACTIVE").length || 0
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>业务配置ID</TableHead>
                <TableHead>版本数</TableHead>
                <TableHead>活跃版本</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: pagination.pageSize }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
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
        <div className="flex justify-center">
          <Skeleton className="h-10 w-80" />
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
              <TableHead>名称</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>业务配置ID</TableHead>
              <TableHead>版本数</TableHead>
              <TableHead>活跃版本</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  未找到调用配置。创建您的第一个调用配置以开始使用。
                </TableCell>
              </TableRow>
            ) : (
              configs.map((config) => (
                <TableRow key={config.bizID}>
                  <TableCell>
                    <div className="font-medium">{config.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={config.description}>
                      {config.description || "无描述"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{config.bizID}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{config.versions?.length || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getActiveVersionsCount(config) > 0 ? "default" : "secondary"}>
                      {getActiveVersionsCount(config)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(config.ctime)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/invocation-config/${config.bizID}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">查看</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/invocation-config/${config.bizID}/edit`}>
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">编辑</span>
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={deleting === config.bizID.toString()}>
                            {deleting === config.bizID.toString() ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">删除</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>删除调用配置</AlertDialogTitle>
                            <AlertDialogDescription>
                              确定要删除调用配置 "{config.name}" 吗？此操作无法撤销，同时会删除该配置下的所有版本。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(config.bizID.toString(), config.name)}
                              disabled={deleting === config.bizID.toString()}
                            >
                              {deleting === config.bizID.toString() ? (
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
