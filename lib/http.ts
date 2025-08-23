import axios, { type AxiosResponse } from "axios"
import { toast } from "@/hooks/use-toast"

// 创建 axios 实例
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9002",
  timeout: 10000,
  withCredentials: true, // 支持 cookie
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.error("请求错误:", error)
    return Promise.reject(error)
  },
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    console.error("响应错误:", error)

    // 处理 401 未授权错误
    if (error.response?.status === 401) {
      // 清除用户信息并跳转到登录页
      localStorage.removeItem("user_info")
      localStorage.removeItem("is_logged_in")
      window.location.href = "/login"
      return Promise.reject(error)
    }

    // 显示错误提示
    const message = error.response?.data?.msg || error.message || "网络错误"
    toast({
      title: "错误",
      description: message,
      variant: "destructive",
    })

    return Promise.reject(error)
  },
)

export { http }
