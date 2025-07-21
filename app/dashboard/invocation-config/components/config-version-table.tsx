"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { http } from "@/lib/http"
import { useToast } from "@/hooks/use-toast"
import type {ConfigVersion} from "@/lib/types/llm_invocation"
import {DataList, Result} from "@/lib/types/result";

interface PaginationData {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

interface ConfigVersionTableProps {
  configId: number
}

export function ConfigVersionTable({ configId }: ConfigVersionTableProps) {
  const [versions, setVersions] = useState<ConfigVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  })
  const router = useRouter()
  const { toast } = useToast()

  const fetchVersions = async (page = 1, search = "") => {
    try {
      setLoading(true)

      const offset = (page-1) * pagination.pageSize

      const resp = await http.post<Result<DataList<ConfigVersion>>>(`/invocation-configs/versions/list`, {invID: configId, offset: offset, limit: pagination.pageSize})
      const result = resp.data
      if (result.code === 0) {
        setVersions(result.data.list || [])
        setPagination({
          page: page + 1,
          pageSize: pagination.pageSize,
          total: result.data.total || 0,
          totalPages: Math.ceil(result.data.total/pagination.pageSize),
        })
      } else {
        toast({
          title: "获取数据失败",
          description: result.msg || "无法获取配置版本列表",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("获取配置版本列表失败:", error)
      toast({
        title: "获取数据失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVersions(1, searchTerm)
  }, [configId])

  const handleSearch = () => {
    fetchVersions(1, searchTerm)
  }

  const handlePageChange = (page: number) => {
    fetchVersions(page, searchTerm)
  }

  const handleDelete = async (versionId: number) => {
    try {
      const result = await http.delete(`/config-versions/${versionId}`)
      if (result.code === 0) {
        toast({
          title: "删除成功",
          description: "配置版本已删除",
        })
        // 如果当前页没有数据了，回到上一页
        const newTotal = pagination.total - 1
        const newTotalPages = Math.ceil(newTotal / pagination.pageSize)
        const targetPage = pagination.page > newTotalPages ? Math.max(1, newTotalPages) : pagination.page
        fetchVersions(targetPage, searchTerm)
      } else {
        toast({
          title: "删除失败",
          description: result.msg || "删除配置版本失败",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("删除配置版本失败:", error)
      toast({
        title: "删除失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (versionId: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1
      const result = await http.patch(`/config-versions/${versionId}/status`, { status: newStatus })
      if (result.code === 0) {
        toast({
          title: "状态更新成功",
          description: `配置版本已${newStatus === 1 ? "启用" : "禁用"}`,
        })
        fetchVersions(pagination.page, searchTerm)
      } else {
        toast({
          title: "状态更新失败",
          description: result.msg || "更新配置版本状态失败",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("更新配置版本状态失败:", error)
      toast({
        title: "状态更新失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>配置版本</CardTitle>
            <CardDescription>管理此调用配置的版本</CardDescription>
          </div>
          <Button onClick={() => router.push(`/dashboard/invocation-config/${configId}/versions/new`)}>
            <Plus className="mr-2 h-4 w-4" />
            新建版本
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索版本名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-8"
            />
          </div>
          <Button onClick={handleSearch} variant="outline">
            搜索
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>版本名称</TableHead>
                <TableHead>模型</TableHead>
                <TableHead>温度</TableHead>
                <TableHead>最大Token</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
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
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : versions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    暂无版本数据
                  </TableCell>
                </TableRow>
              ) : (
                versions.map((version) => (
                  <TableRow key={version.id}>
                    <TableCell className="font-medium">{version.id}</TableCell>
                    <TableCell>{version.name}</TableCell>
                    <TableCell>{version.model}</TableCell>
                    <TableCell>{version.temperature}</TableCell>
                    <TableCell>{version.maxTokens}</TableCell>
                    <TableCell>
                      <Badge variant={version.status === 1 ? "default" : "secondary"}>
                        {version.status === 1 ? "启用" : "禁用"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(version.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/invocation-config/${configId}/versions/${version.id}`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/invocation-config/${configId}/versions/${version.id}/edit`)
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(version.id, version.status)}>
                            {version.status === 1 ? "禁用" : "启用"}
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                删除
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>确认删除</AlertDialogTitle>
                                <AlertDialogDescription>
                                  确定要删除配置版本 "{version.name}" 吗？此操作无法撤销。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(version.id)}>删除</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!loading && versions.length > 0 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              显示 {(pagination.page - 1) * pagination.pageSize + 1} 到{" "}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} 条，共 {pagination.total} 条记录
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
      </CardContent>
    </Card>
  )
}
