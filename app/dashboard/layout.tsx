"use client"

import type React from "react"
import { useState } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <DashboardNav
          className={`border-r hidden md:block transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"}`}
          collapsed={sidebarCollapsed}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
