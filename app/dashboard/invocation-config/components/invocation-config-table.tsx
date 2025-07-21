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
import { invocationConfigApi, type InvocationConfigVO, type PaginatedResponse } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function InvocationConfigTable() {
  const { toast } = useToast()
  const [configs, setConfigs] = useState<InvocationConfigVO[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
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
      const result = await invocationConfigApi.list(page, pageSize)

      if (result.code === 0) {
        // 如果 API 返回分页数据
        if (typeof result.data === "object" && "data" in result.data) {
          const paginatedData = result.data as unknown as PaginatedResponse<InvocationConfigVO>
          setConfigs(paginatedData.data)
          setPagination({
            page: paginatedData.page,
            pageSize: paginatedData.pageSize,
            total: paginatedData.total,
            totalPages: paginatedData.totalPages,
          })
        } else {
          // 如果 API 返回简单数组，模拟分页
          const allData = result.data as InvocationConfigVO[]
          const startIndex = (page - 1) * pageSize
          const endIndex = startIndex + pageSize
          const paginatedData = allData.slice(startIndex, endIndex)

          setConfigs(paginatedData)
          setPagination({
            page,
            pageSize,
            total: allData.length,
            totalPages: Math.ceil(allData.length / pageSize),
          })
        }
      } else {
        toast({
          title: "获取失败",
          description: result.msg || "获取调用配置列表失败",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("获取调用配置列表失败:", error)
      toast({
        title: "获取失败",
        description: "获取调用配置列表失败，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 删除调用配置
  const handleDelete = async (id: number) => {
    try {
      setDeleting(id)
      const result = await invocationConfigApi.delete(id)

      if (result.code === 0) {
        toast({
          title: "删除成功",
          description: "调用配置已成功删除",
        })
        // 重新获取当前页数据
        await fetchConfigs(pagination.page, pagination.pageSize)
      } else {
        toast({
          title: "删除失败",
          description: result.msg || "删除调用配置失败",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("删除调用配置失败:", error)
      toast({
        title: "删除失败",
        description: "删除调用配置失败，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  // 页面变化处理
  const handlePageChange = (page: number) => {
    fetchConfigs(page, pagination.pageSize)
  }

  // 初始化加载
  useEffect(() => {
    fetchConfigs()
  }, [])

  // 生成分页链接
  const generatePaginationItems = () => {
    const items = []
    const { page, totalPages } = pagination

    // 显示前几页
    for (let i = 1; i <= Math.min(3, totalPages); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => handlePageChange(i)} isActive={page === i} className="cursor-pointer">
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    // 显示省略号
    if (totalPages > 6 && page > 4) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // 显示当前页附近的页码
    const start = Math.max(4, page - 1)
    const end = Math.min(totalPages - 3, page + 1)

    for (let i = start; i <= end; i++) {
      if (i > 3 && i < totalPages - 2) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => handlePageChange(i)} isActive={page === i} className="cursor-pointer">
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    }

    // 显示省略号
    if (totalPages > 6 && page < totalPages - 3) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // 显示最后几页
    for (let i = Math.max(totalPages - 2, 4); i <= totalPages; i++) {
      if (i > 3) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => handlePageChange(i)} isActive={page === i} className="cursor-pointer">
              {i}
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
                <TableHead>名称</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>业务配置ID</TableHead>
                <TableHead>版本数</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                    </div>
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
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
                    <div className="max-w-xs truncate">{config.description || "无描述"}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{config.bizID}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{config.versions?.length || 0}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{new Date(config.ctime * 1000).toLocaleDateString()}</div>
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
                          <Button variant="ghost" size="icon" disabled={deleting === config.bizID}>
                            {deleting === config.bizID ? (
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
                              确定要删除调用配置 "{config.name}" 吗？此操作无法撤销。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(config.bizID)}
                              disabled={deleting === config.bizID}
                            >
                              {deleting === config.bizID ? (
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
