"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sparkles, Settings, Cpu, Server } from "lucide-react"
import { usePathname } from "next/navigation"

interface DashboardNavProps {
  className?: string
  collapsed?: boolean
}

export function DashboardNav({ className, collapsed = false }: DashboardNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "模型服务商",
      href: "/dashboard/provider",
      icon: <Server className="h-5 w-5" />,
    },
    {
      title: "业务配置",
      href: "/dashboard/biz-config",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "调用配置",
      href: "/dashboard/invocation-config",
      icon: <Sparkles className="h-5 w-5" />,
    },
  ]

  const isActive = (href: string) => {
    return pathname.startsWith(href)
  }

  return (
    <nav className={cn("flex flex-col gap-2 p-4", className)}>
      {!collapsed && <div className="text-lg font-semibold px-4 py-2">AI 管理后台</div>}
      {collapsed && (
        <div className="h-10 flex items-center justify-center mb-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">AI</span>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={isActive(item.href) ? "secondary" : "ghost"}
            className={cn("justify-start", collapsed ? "w-12 h-12 p-0" : "w-full")}
            asChild
          >
            <Link href={item.href}>
              <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-2")}>
                {item.icon}
                {!collapsed && <span className="ml-2">{item.title}</span>}
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
}
