"use client"

import { Badge } from "@/components/ui/badge"

interface NumberVisualProps {
  number: number
  showBreakdown?: boolean
  size?: "sm" | "md" | "lg"
}

export function NumberVisual({ number, showBreakdown = true, size = "md" }: NumberVisualProps) {
  // Size configurations
  const sizeConfig = {
    sm: { main: "text-4xl", label: "text-xs", badge: "text-xs px-2 py-1" },
    md: { main: "text-6xl", label: "text-sm", badge: "text-sm px-3 py-1" },
    lg: { main: "text-8xl", label: "text-base", badge: "text-base px-4 py-2" },
  }

  const config = sizeConfig[size]

  // Break down number into components
  const breakdown: { value: number; label: string; color: string }[] = []

  if (number >= 100000000) {
    // 億 (hundred million)
    const oku = Math.floor(number / 100000000)
    breakdown.push({ value: oku * 100000000, label: `${oku}億`, color: "bg-purple-600" })
  }

  const remaining1 = number % 100000000
  if (remaining1 >= 10000) {
    // 万 (ten thousand)
    const man = Math.floor(remaining1 / 10000)
    breakdown.push({ value: man * 10000, label: `${man}万`, color: "bg-blue-600" })
  }

  const remaining2 = remaining1 % 10000
  if (remaining2 >= 1000) {
    // 千 (thousand)
    const sen = Math.floor(remaining2 / 1000)
    breakdown.push({ value: sen * 1000, label: `${sen}千`, color: "bg-green-600" })
  }

  const remaining3 = remaining2 % 1000
  if (remaining3 >= 100) {
    // 百 (hundred)
    const hyaku = Math.floor(remaining3 / 100)
    breakdown.push({ value: hyaku * 100, label: `${hyaku}百`, color: "bg-yellow-600" })
  }

  const remaining4 = remaining3 % 100
  if (remaining4 >= 10) {
    // 十 (ten)
    const juu = Math.floor(remaining4 / 10)
    breakdown.push({ value: juu * 10, label: `${juu}十`, color: "bg-orange-600" })
  }

  const ones = remaining4 % 10
  if (ones > 0) {
    breakdown.push({ value: ones, label: ones.toString(), color: "bg-red-600" })
  }

  // Format number with commas
  const formattedNumber = number.toLocaleString()

  // Visual representation with blocks
  const getBlockRepresentation = (num: number) => {
    if (num === 0) return null

    // Show visual blocks for small numbers (1-10)
    if (num <= 10) {
      return (
        <div className="flex gap-1 flex-wrap justify-center mt-2">
          {Array.from({ length: num }).map((_, i) => (
            <div
              key={i}
              className="w-6 h-6 bg-purple-500 rounded shadow-sm"
            />
          ))}
        </div>
      )
    }

    // For larger numbers, show stacked blocks
    if (num <= 100) {
      const tens = Math.floor(num / 10)
      const onesDigit = num % 10

      return (
        <div className="flex gap-3 items-end justify-center mt-2">
          {/* Tens */}
          {Array.from({ length: tens }).map((_, i) => (
            <div key={`ten-${i}`} className="flex flex-col gap-0.5">
              {Array.from({ length: 10 }).map((_, j) => (
                <div
                  key={j}
                  className="w-4 h-4 bg-blue-500 rounded-sm"
                />
              ))}
            </div>
          ))}
          {/* Ones */}
          {onesDigit > 0 && (
            <div className="flex flex-col gap-0.5">
              {Array.from({ length: onesDigit }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-purple-500 rounded-sm"
                />
              ))}
            </div>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-lg">
      {/* Main number display */}
      <div className="text-center">
        <div className={`${config.main} font-bold text-purple-700 dark:text-purple-300`}>
          {formattedNumber}
        </div>
        <div className={`${config.label} text-gray-500 dark:text-gray-400 mt-1`}>
          {number === 0 ? "zero" : ""}
        </div>
      </div>

      {/* Number breakdown */}
      {showBreakdown && breakdown.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {breakdown.map((part, i) => (
            <Badge
              key={i}
              className={`${part.color} text-white ${config.badge} font-semibold`}
            >
              {part.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Visual blocks */}
      {number <= 100 && (
        <div className="max-w-sm">
          {getBlockRepresentation(number)}
        </div>
      )}

      {/* Large number explanation */}
      {number > 100 && (
        <div className={`${config.label} text-center text-gray-600 dark:text-gray-400 max-w-xs`}>
          {number >= 100000000 && "日本語: 億 (oku) = 100 million"}
          {number >= 10000 && number < 100000000 && "日本語: 万 (man) = 10 thousand"}
        </div>
      )}
    </div>
  )
}
