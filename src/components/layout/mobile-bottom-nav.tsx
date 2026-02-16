"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpenCheck, Target, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Learn",
      href: "/study",
      icon: BookOpenCheck,
      activePattern: ["/study", "/vocabulary", "/verbs", "/dlingo"]
    },
    {
      name: "Practice",
      href: "/quiz",
      icon: Target,
      activePattern: ["/quiz", "/dlingo-special"]
    },
    {
      name: "Track",
      href: "/progress",
      icon: BarChart3,
      activePattern: ["/progress", "/analytics"]
    },
    {
      name: "System",
      href: "/settings",
      icon: Settings,
      activePattern: ["/settings", "/manage", "/reset-database"]
    }
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = item.activePattern.some(
            (pattern) => pathname === pattern || pathname?.startsWith(pattern + '/')
          )

          return (
            <Link
              key={item.name}
              href={item.href as any}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
