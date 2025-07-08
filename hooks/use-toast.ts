"use client"

// This is a simplified version of the toast hook
// In a real app, you would use a proper toast library

import { useState } from "react"

type ToastVariant = "default" | "destructive" | "success"

interface ToastProps {
  title: string
  description: string
  variant?: ToastVariant
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    // In a real app, this would show a toast notification
    console.log("TOAST:", props)

    // For demo purposes, we'll just use browser alert
    alert(`${props.title}: ${props.description}`)
  }

  return { toast, toasts }
}
