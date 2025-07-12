import type { Profile } from "@/lib/types/user"

const USER_INFO_KEY = "user_info"
const LOGIN_STATUS_KEY = "is_logged_in"

// 保存用户信息
export function saveUserInfo(profile: Profile): void {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(profile))
  localStorage.setItem(LOGIN_STATUS_KEY, "true")
}

// 获取用户信息
export function getUserInfo(): Profile | null {
  try {
    const userInfo = localStorage.getItem(USER_INFO_KEY)
    return userInfo ? JSON.parse(userInfo) : null
  } catch (error) {
    console.error("获取用户信息失败:", error)
    return null
  }
}

// 检查是否已登录
export function isLoggedIn(): boolean {
  return localStorage.getItem(LOGIN_STATUS_KEY) === "true"
}

// 清除用户信息
export function clearUserInfo(): void {
  localStorage.removeItem(USER_INFO_KEY)
  localStorage.removeItem(LOGIN_STATUS_KEY)
}

// 标记登录状态
export function markLogin(): void {
  localStorage.setItem(LOGIN_STATUS_KEY, "true")
}

// 设置用户信息（兼容旧代码）
export const setUserInfo = saveUserInfo
