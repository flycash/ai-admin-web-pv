"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getUserInfo, clearUserInfo } from "@/lib/utils/user"
import type { Profile } from "@/lib/types/user"

interface AuthContextType {
  user: Profile
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile>({} as Profile)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 从本地存储获取用户信息
    const storedUser = getUserInfo()
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // 如果用户未登录且不在登录页面，重定向到登录页
    if (!loading && !user && pathname !== "/login") {
      router.push("/login")
    }
  }, [user, loading, pathname, router])

  const login = async (username: string, password: string): Promise<boolean> => {
    // try {
    //   const result = await userApi.login({ username, password })
    //   if (result.code === 0) {
    //     setUser(result.data.user)
    //     saveUserInfo(result.data.user)
    //     return true
    //   }
    //   return false
    // } catch (error) {
    //   console.error("登录失败:", error)
    //   return false
    // }
    return true
  }

  const logout = () => {
    setUser({} as Profile)
    clearUserInfo()
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
