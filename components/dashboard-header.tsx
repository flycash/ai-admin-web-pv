"use client"

import { Button } from "@/components/ui/button"
import { MenuIcon, PanelLeftClose } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardNav } from "@/components/dashboard-nav"

interface DashboardHeaderProps {
  onToggleSidebar?: () => void
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden bg-transparent">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">切换导航菜单</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <DashboardNav className="border-0" collapsed={false} />
        </SheetContent>
      </Sheet>

      <Button variant="outline" size="icon" className="hidden md:flex bg-transparent" onClick={onToggleSidebar}>
        <PanelLeftClose className="h-5 w-5" />
        <span className="sr-only">切换侧边栏</span>
      </Button>

      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <span className="text-lg">AI 管理后台</span>
      </Link>
    </header>
  )
}
