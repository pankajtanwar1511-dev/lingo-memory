"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Moon, Sun, BookOpen, Trophy, Settings, Menu, X, Zap, Library,
  BarChart3, GraduationCap, Wrench, Database, Languages, BookMarked,
  FlaskConical, BookOpenCheck, Target, LayoutDashboard, Building2
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserProfile } from "@/components/user-profile"
import { NavigationDropdown, type NavigationItem } from "@/components/layout/navigation-dropdown"
import { cn } from "@/lib/utils"

export function Header() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Organized navigation categories
  const navigationCategories = [
    {
      label: "LEARN",
      icon: BookOpenCheck,
      items: [
        {
          name: "Study",
          href: "/study",
          icon: BookOpen,
          description: "Flashcards with FSRS algorithm"
        },
        {
          name: "Kanji",
          href: "/study/kanji",
          icon: Languages,
          badge: "86",
          badgeVariant: "default" as const,
          description: "37-lesson reference + vocab reveal SRS"
        },
        {
          name: "Vocabulary",
          href: "/vocabulary",
          icon: Library,
          description: "N5 vocab deck (800+ words)"
        },
        {
          name: "Verbs",
          href: "/verbs",
          icon: FlaskConical,
          badge: "166",
          badgeVariant: "success" as const,
          description: "166 verbs + quiz master"
        },
        {
          name: "Extended Verbs",
          href: "/verbs-extended",
          icon: FlaskConical,
          badge: "104",
          badgeVariant: "default" as const,
          description: "104 additional verbs"
        },
        {
          name: "Office Japanese",
          href: "/office",
          icon: Building2,
          badge: "241",
          badgeVariant: "default" as const,
          description: "Office vocab, drills & scenarios"
        },
        {
          name: "Dlingo",
          href: "/dlingo",
          icon: BookMarked,
          description: "Vocabulary review & special modes"
        },
      ] as NavigationItem[]
    },
    {
      label: "PRACTICE",
      icon: Target,
      items: [
        {
          name: "Quiz",
          href: "/quiz",
          icon: GraduationCap,
          badge: "NEW",
          badgeVariant: "default" as const,
          description: "Test your knowledge"
        },
      ] as NavigationItem[]
    },
    {
      label: "TRACK",
      icon: BarChart3,
      items: [
        {
          name: "Insights",
          href: "/insights",
          icon: BarChart3,
          badge: "NEW",
          badgeVariant: "success" as const,
          description: "Progress & analytics combined"
        },
      ] as NavigationItem[]
    },
    {
      label: "SYSTEM",
      icon: Settings,
      items: [
        {
          name: "Settings",
          href: "/settings",
          icon: Settings,
          description: "Preferences, manage & database"
        },
      ] as NavigationItem[]
    }
  ]

  // Flatten for mobile menu
  const allNavigationItems = navigationCategories.flatMap(cat => cat.items)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-r from-primary to-secondary text-white p-2 rounded-lg">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
              <span className="font-bold text-xl gradient-text">LingoMemory</span>
            </Link>
            <Badge variant="gradient" className="hidden sm:flex">
              <Zap className="h-3 w-3 mr-1" />
              Beta
            </Badge>
          </div>

          {/* Desktop navigation with dropdowns */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md",
                pathname === "/dashboard"
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            {navigationCategories.map((category) => (
              <NavigationDropdown
                key={category.label}
                label={category.label}
                icon={category.icon}
                items={category.items}
              />
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden sm:flex"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}

            {/* User profile / Sign in */}
            <div className="hidden sm:flex">
              <UserProfile />
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-1 border-t">
            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors mb-2",
                pathname === "/dashboard"
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            {/* Organized by category */}
            {navigationCategories.map((category) => (
              <div key={category.label} className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category.label}
                </div>
                {category.items.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.name}
                      href={item.href as any}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "text-primary bg-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant || "default"}
                          className="text-xs px-1.5 py-0"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </div>
            ))}

            {/* Mobile theme toggle */}
            <div className="flex items-center justify-between px-3 py-2 mt-4 border-t">
              <span className="text-sm font-medium">Theme</span>
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>

            {/* Mobile user profile */}
            <div className="px-3 pt-2">
              <UserProfile />
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
