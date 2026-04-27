"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useIsAdmin } from "@/lib/admin"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Cloud, CloudOff, LogIn, ShieldCheck } from "lucide-react"

export function UserProfile() {
  const router = useRouter()
  const { user, isAuthenticated, signOut, isFirebaseAvailable } = useAuth()
  const isAdmin = useIsAdmin()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setSigningOut(false)
    }
  }

  // If Firebase not available, show sign in button (for offline mode demo)
  if (!isFirebaseAvailable) {
    return (
      <Link href="/login">
        <Button size="sm" variant="outline" className="gap-2">
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </Link>
    )
  }

  // If not authenticated, show login button
  if (!isAuthenticated) {
    return (
      <Link href="/login">
        <Button size="sm" className="gap-2">
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </Link>
    )
  }

  // If authenticated, show user menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="h-6 w-6 rounded-full"
            />
          ) : (
            <User className="h-4 w-4" />
          )}
          <span className="hidden md:inline">{user?.displayName || "User"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName || "User"}</p>
            <p className="text-xs leading-none text-gray-500">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="w-full cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin/access" className="w-full cursor-pointer">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin access
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="cursor-pointer">
          <Cloud className="mr-2 h-4 w-4" />
          <span>Synced</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={signingOut}
          className="cursor-pointer text-red-600 dark:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{signingOut ? "Signing out..." : "Sign Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
