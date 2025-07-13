"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { http } from "@/lib/http"
import { saveUserInfo } from "@/lib/utils/user"
import type { LoginResponse } from "@/lib/types/user"

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
      const response = await http.post<LoginResponse>("/api/auth/login", {
        username,
        password,
      })

      const result = response.data

      if (result.code === 0) {
        // 登录成功
        saveUserInfo(result.data)

        toast({
          title: "登录成功",
          description: `欢迎回来，${result.data.nickname}！`,
          variant: "default",
        })

        // 跳转到仪表板
        router.push("/dashboard")
      } else {
        // 登录失败
        toast({
          title: "登录失败",
          description: result.msg,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "登录失败",
        description: "网络错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAutoLogin = async () => {
    setIsLoading(true)

    try {

      await http.post<LoginResponse>("/mock/login")
      // 模拟自动登录
      const mockProfile = {
        id: 1,
        nickname: "模拟用户",
        avatar: "",
      }

      saveUserInfo(mockProfile)

      toast({
        title: "自动登录成功",
        description: `欢迎回来，${mockProfile.nickname}！`,
        variant: "default",
      })

      // 跳转到仪表板
      router.push("/dashboard/biz-config")
    } catch (error) {
      console.error("Auto login error:", error)
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">登录</CardTitle>
          <CardDescription className="text-center">输入您的凭据以访问您的账户</CardDescription>
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

          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={handleAutoLogin}
            disabled={isLoading}
          >
            {isLoading ? "登录中..." : "自动登录（演示）"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            <p>演示账户：</p>
            <p>用户名：admin</p>
            <p>密码：password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
