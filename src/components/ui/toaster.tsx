"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Toast {
  id: string
  title?: string
  description?: string
  type?: "default" | "success" | "error" | "warning"
  duration?: number
}

interface ToasterProps {
  className?: string
}

const toastStore = {
  listeners: new Set<(toasts: Toast[]) => void>(),
  toasts: [] as Toast[],

  addToast(toast: Omit<Toast, "id">) {
    const id = Date.now().toString()
    const newToast = { ...toast, id }
    this.toasts = [...this.toasts, newToast]
    this.notify()

    setTimeout(() => {
      this.removeToast(id)
    }, toast.duration || 5000)
  },

  removeToast(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id)
    this.notify()
  },

  notify() {
    this.listeners.forEach(listener => listener(this.toasts))
  },

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
}

export const toast = (props: Omit<Toast, "id">) => {
  toastStore.addToast(props)
}

export function Toaster({ className }: ToasterProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return toastStore.subscribe(setToasts)
  }, [])

  const getToastStyles = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "bg-success/10 text-success border-success/20"
      case "error":
        return "bg-danger/10 text-danger border-danger/20"
      case "warning":
        return "bg-warning/10 text-warning border-warning/20"
      default:
        return "bg-card border-border"
    }
  }

  return (
    <div className={cn("fixed bottom-4 right-4 z-50 flex flex-col gap-2", className)}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "relative flex items-center gap-3 rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-2",
            "min-w-[300px] max-w-[400px]",
            getToastStyles(toast.type)
          )}
        >
          <div className="flex-1">
            {toast.title && (
              <div className="font-semibold">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm opacity-90">{toast.description}</div>
            )}
          </div>
          <button
            onClick={() => toastStore.removeToast(toast.id)}
            className="p-1 hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}