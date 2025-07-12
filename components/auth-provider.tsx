"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getUserInfo, clearUserInfo, isLoggedIn } from "@/lib/utils/user"
import type { Profile } from "@/lib/types/user"

interface AuthContextType {
  user: Profile | null
  isAuthenticated: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 检查用户登录状态
    const checkAuth = () => {
      if (isLoggedIn()) {
        const userInfo = getUserInfo()
        if (userInfo) {
          setUser(userInfo)
          setIsAuthenticated(true)
        } else {
          // 如果没有用户信息，清除登录状态
          clearUserInfo()
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  useEffect(() => {
    // 如果用户未登录且不在登录页面，跳转到登录页
    if (!isLoading && !isAuthenticated && !pathname.startsWith("/mock/login")) {
      router.push("/mock/login")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  const logout = () => {
    clearUserInfo()
    setUser(null)
    setIsAuthenticated(false)
    router.push("/mock/login")
  }

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, logout }}>{children}</AuthContext.Provider>
}
