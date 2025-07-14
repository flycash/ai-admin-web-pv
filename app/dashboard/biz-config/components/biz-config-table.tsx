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
import { useToast } from "@/hooks/use-toast"
import {BizConfig} from "@/lib/types/biz_config";
import {http} from "@/lib/http";
import {Result} from "@/lib/types/result";

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function BizConfigTable() {
  const { toast } = useToast()
  const [configs, setConfigs] = useState<BizConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  })

  // 获取配置列表
  const fetchConfigs = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true)
      const resp = await http.post<Result<{
        cfgs: BizConfig[],
        total: number,
      }>>("/biz-configs/list", {
        offset: (page-1) * pageSize,
        limit: pageSize,
      })

      const result = resp.data

      if (result.code === 0) {
        // 如果 API 返回分页数据
        setConfigs(configs.concat(result.data?.cfgs || []))
        setPagination({
          page,
          pageSize,
          total: result.data.total,
          totalPages: Math.ceil(result.data.total / pageSize),
        })
      } else {
        toast({
          title: "获取失败",
          description: result.msg || "获取业务配置列表失败",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("获取业务配置列表失败:", error)
      toast({
        title: "获取失败",
        description: "获取业务配置列表失败，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
                <TableHead>所有者 ID</TableHead>
                <TableHead>所有者类型</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-12" />
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
