"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

export interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
  badge?: string
  badgeVariant?: "default" | "secondary" | "success" | "destructive" | "outline" | "gradient"
  description?: string
}

interface NavigationDropdownProps {
  label: string
  items: NavigationItem[]
  icon?: LucideIcon
}

export function NavigationDropdown({ label, items, icon: Icon }: NavigationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  // Check if any item in this dropdown is active
  const isActiveCategory = items.some(
    (item) => pathname === item.href || pathname?.startsWith(item.href + '/')
  )

  if (!isMounted) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-md",
          isActiveCategory
            ? "text-primary bg-accent"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-64 z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="bg-popover border rounded-lg shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="py-2">
              {items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href as any}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 transition-colors",
                      isActive
                        ? "text-primary bg-accent"
                        : "text-foreground hover:bg-accent"
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.name}</span>
                        {item.badge && (
                          <Badge
                            variant={item.badgeVariant || "default"}
                            className="text-xs px-1.5 py-0"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
