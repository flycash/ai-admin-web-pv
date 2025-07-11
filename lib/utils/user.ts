import type { Profile } from "@/lib/types/user"

// 用户信息相关的工具函数

/**
 * 保存用户信息到 localStorage
 */
export function setUserInfo(profile: Profile): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("user_info", JSON.stringify(profile))
  }
}

/**
 * 从 localStorage 获取用户信息
 */
export function getUserInfo(): Profile | null {
  if (typeof window !== "undefined") {
    const userInfo = localStorage.getItem("user_info")
    if (userInfo) {
      try {
        return JSON.parse(userInfo) as Profile
      } catch (error) {
        console.error("Failed to parse user info:", error)
        return null
      }
    }
  }
  return null
}

/**
 * 保存认证 token
 */
export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

/**
 * 获取认证 token
 */
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

/**
 * 标记用户已登录
 */
export function markLogin(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("is_logged_in", "true")
  }
}

/**
 * 检查用户是否已登录
 */
export function isLoggedIn(): boolean {
  if (typeof window !== "undefined") {
    const isLoggedIn = localStorage.getItem("is_logged_in")
    const token = localStorage.getItem("auth_token")
    return isLoggedIn === "true" && !!token
  }
  return false
}

/**
 * 清除所有用户数据
 */
export function clearUserData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_info")
    localStorage.removeItem("auth_token")
    localStorage.removeItem("is_logged_in")
  }
}
