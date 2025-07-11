"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { Profile } from "@/lib/types/user"
import { getUserInfo, isLoggedIn, clearUserData } from "@/lib/utils/user"

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

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Profile | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = isLoggedIn()
      const userInfo = getUserInfo()

      setIsAuthenticated(loggedIn)
      setUser(userInfo)
      setIsLoading(false)

      // 如果未登录且不在登录页面，跳转到登录页
      if (!loggedIn && pathname !== "/mock/login") {
        router.push("/mock/login")
      }
    }

    checkAuth()
  }, [pathname, router])

  const logout = () => {
    clearUserData()
    setUser(null)
    setIsAuthenticated(false)
    router.push("/mock/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, logout }}>{children}</AuthContext.Provider>
}
