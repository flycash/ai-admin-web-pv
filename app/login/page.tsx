"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { userApi } from "@/lib/api"
import { setUserInfo } from "@/lib/utils/user"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await userApi.login({ username, password })

      if (result.success && result.data) {
        // 保存用户信息和token
        setUserInfo(result.data.user, result.data.token)

        toast({
          title: "登录成功",
          description: `欢迎回来，${result.data.user.name}！`,
        })

        router.push("/dashboard")
      } else {
        toast({
          title: "登录失败",
          description: result.message || "用户名或密码错误",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "登录失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAutoLogin = async () => {
    setIsLoading(true)

    try {
      // 模拟自动登录
      const mockUser = {
        id: "1",
        name: "管理员",
        username: "admin",
        email: "admin@example.com",
        role: "admin" as const,
        avatar: "/placeholder-user.jpg",
      }

      const mockToken = "mock-jwt-token-" + Date.now()

      // 保存用户信息
      setUserInfo(mockUser, mockToken)

      toast({
        title: "自动登录成功",
        description: `欢迎回来，${mockUser.name}！`,
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "自动登录失败",
        description: "请手动登录",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">AI 管理后台</CardTitle>
          <CardDescription className="text-center">请登录您的账户</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "登录中..." : "登录"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">或者</span>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent" onClick={handleAutoLogin} disabled={isLoading}>
            {isLoading ? "登录中..." : "一键登录（演示）"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
