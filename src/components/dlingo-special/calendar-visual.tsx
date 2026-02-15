"use client"

import { Badge } from "@/components/ui/badge"

interface CalendarVisualProps {
  year?: number
  month?: number // 1-12
  day?: number // 1-31
  dayOfWeek?: number // 0-6 (Sunday-Saturday)
  highlightDay?: boolean
  showWeekdays?: boolean
  size?: "sm" | "md" | "lg"
}

export function CalendarVisual({
  year,
  month,
  day,
  dayOfWeek,
  highlightDay = true,
  showWeekdays = true,
  size = "md",
}: CalendarVisualProps) {
  const currentDate = new Date()
  const displayYear = year || currentDate.getFullYear()
  const displayMonth = month || currentDate.getMonth() + 1
  const displayDay = day

  // Get first day of month and total days
  const firstDayOfMonth = new Date(displayYear, displayMonth - 1, 1).getDay()
  const daysInMonth = new Date(displayYear, displayMonth, 0).getDate()

  // Week day names (Japanese)
  const weekdayNames = ["日", "月", "火", "水", "木", "金", "土"]
  const weekdayColors = [
    "text-red-600", // Sunday
    "text-gray-700", // Monday
    "text-gray-700", // Tuesday
    "text-gray-700", // Wednesday
    "text-gray-700", // Thursday
    "text-gray-700", // Friday
    "text-blue-600", // Saturday
  ]

  // Size configurations
  const sizeConfig = {
    sm: { container: "w-48", cell: "w-6 h-6", text: "text-xs", header: "text-sm" },
    md: { container: "w-64", cell: "w-8 h-8", text: "text-sm", header: "text-base" },
    lg: { container: "w-80", cell: "w-10 h-10", text: "text-base", header: "text-lg" },
  }

  const config = sizeConfig[size]

  // Generate calendar grid
  const calendarDays: (number | null)[] = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null) // Empty cells before month starts
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  // Month names (English)
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  return (
    <div className={`${config.container} mx-auto`}>
      {/* Month/Year header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg py-3 px-4">
        <div className={`${config.header} font-bold text-center`}>
          {monthNames[displayMonth - 1]}
        </div>
        <div className="text-xs text-center opacity-90">{displayYear}</div>
      </div>

      {/* Calendar body */}
      <div className="bg-white dark:bg-gray-800 rounded-b-lg p-2 border-2 border-purple-600 border-t-0">
        {/* Weekday headers */}
        {showWeekdays && (
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdayNames.map((name, i) => (
              <div
                key={name}
                className={`${config.cell} flex items-center justify-center font-semibold ${weekdayColors[i]}`}
              >
                <span className={config.text}>{name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayNum, index) => {
            const isHighlighted = dayNum === displayDay && highlightDay
            const dayWeek = dayNum ? (firstDayOfMonth + dayNum - 1) % 7 : null

            return (
              <div
                key={index}
                className={`${config.cell} flex items-center justify-center rounded ${
                  isHighlighted
                    ? "bg-purple-600 text-white font-bold shadow-lg scale-110"
                    : dayNum
                    ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    : ""
                } transition-all`}
              >
                {dayNum && (
                  <span className={`${config.text} ${dayWeek === 0 ? "text-red-600" : dayWeek === 6 ? "text-blue-600" : ""} ${isHighlighted ? "text-white" : ""}`}>
                    {dayNum}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Day of week indicator */}
      {dayOfWeek !== undefined && (
        <div className="mt-2 text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${weekdayColors[dayOfWeek]} bg-gray-100 dark:bg-gray-800`}>
            {["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"][dayOfWeek]}
          </span>
        </div>
      )}
    </div>
  )
}
