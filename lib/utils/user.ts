import type { Profile } from "@/lib/types/user"

export function saveUserInfo(profile: Profile) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user_info", JSON.stringify(profile))
    localStorage.setItem("is_logged_in", "true")
  }
}

export function getUserInfo(): Profile {
  if (typeof window !== "undefined") {
    const userInfo = localStorage.getItem("user_info")
    try {
      return userInfo ? JSON.parse(userInfo) : {} as Profile
    } catch (e) {
      console.log(e, userInfo)
      return {} as Profile
    }
  }
  return {} as Profile
}

export function clearUserInfo() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_info")
    localStorage.removeItem("is_logged_in")
  }
}

export function isLoggedIn(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("is_logged_in") === "true"
  }
  return false
}
