import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"
import { toast } from "@/hooks/use-toast"

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 启用 cookie 传递
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    console.log("HTTP Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers,
    })

    return config
  },
  (error) => {
    console.error("Request Error:", error)
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("HTTP Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    })

    return response
  },
  (error) => {
    console.error("Response Error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    })

    // 处理 401 未授权错误
    if (error.response?.status === 401) {
      // 清除本地存储的用户信息
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_info")
        localStorage.removeItem("is_logged_in")

        // 跳转到登录页
        window.location.href = "/mock/login"
      }
    }

    // 显示错误提示
    if (typeof window !== "undefined") {
      const errorMessage = error.response?.data?.msg || error.message || "请求失败"

      // 使用 toast 组件显示错误
      toast({
        title: "请求错误",
        description: errorMessage,
        variant: "destructive",
      })
    }

    return Promise.reject(error)
  },
)

// 封装常用的 HTTP 方法
export const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return instance.get(url, config)
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return instance.post(url, data, config)
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return instance.put(url, data, config)
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return instance.delete(url, config)
  },

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return instance.patch(url, data, config)
  },
}

export default http
