"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, LogIn, User } from "lucide-react"
import { http } from "@/lib/http"
import type { LoginResponse } from "@/lib/types/user"
import { setUserInfo, setAuthToken, markLogin } from "@/lib/utils/user"
import { useToast } from "@/hooks/use-toast"

const LoginPage: React.FC = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [autoLogin, setAutoLogin] = useState(false)

  // 自动登录逻辑
  useEffect(() => {
    if (autoLogin) {
      handleMockLogin()
    }
  }, [autoLogin])

  const handleMockLogin = async () => {
    setIsLoading(true)

    try {
      const response = await http.get<LoginResponse>("/mock/login")
      const data = response.data

      if (data?.code === 0) {
        const { profile, token } = data.data

        // 保存用户信息和 token
        setUserInfo(profile)
        setAuthToken(token)
        markLogin()

        toast({
          title: "登录成功",
          description: `欢迎回来，${profile.username}！`,
        })

        // 跳转到主页面
        router.push("/dashboard")
        router.refresh()
      } else {
        toast({
          title: "登录失败",
          description: data?.message || "登录失败，请重试",
          variant: "destructive",
        })
      }
    } catch (error) {
      // 错误已经在 http 拦截器中处理了
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualLogin = () => {
    handleMockLogin()
  }

  // 页面加载时自动触发登录
  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoLogin(true)
    }, 1000) // 1秒后自动登录

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">AI 管理后台</CardTitle>
          <CardDescription>模拟登录系统</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-4 text-sm text-muted-foreground">{autoLogin ? "正在自动登录..." : "登录中..."}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">点击下方按钮进行模拟登录</p>
                <Button onClick={handleManualLogin} className="w-full" size="lg">
                  <LogIn className="mr-2 h-4 w-4" />
                  模拟登录
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">这是一个模拟登录页面，用于开发和测试</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
