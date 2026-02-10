"use client"

import { useEffect, useState } from "react"

interface ClockVisualProps {
  hour?: number // 0-23
  minute?: number // 0-59
  showLabels?: boolean
  size?: number // Size in pixels
  animated?: boolean
}

export function ClockVisual({
  hour,
  minute,
  showLabels = true,
  size = 200,
  animated = false,
}: ClockVisualProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    if (!animated) return

    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [animated])

  // Use provided time or current time if animated
  const displayHour = hour !== undefined ? hour : (animated ? currentTime.getHours() : 0)
  const displayMinute = minute !== undefined ? minute : (animated ? currentTime.getMinutes() : 0)

  // Convert to 12-hour format for display
  const hour12 = displayHour % 12 || 12
  const minuteAngle = (displayMinute / 60) * 360
  const hourAngle = ((displayHour % 12) / 12) * 360 + (displayMinute / 60) * 30 // Hour hand moves with minutes

  const radius = size / 2
  const centerX = size / 2
  const centerY = size / 2

  // Clock numbers positions
  const clockNumbers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180) // Start from 12 o'clock
    const numberRadius = radius * 0.75
    const x = centerX + numberRadius * Math.cos(angle)
    const y = centerY + numberRadius * Math.sin(angle)
    return { number: i === 0 ? 12 : i, x, y }
  })

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-lg"
      >
        {/* Clock face */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius - 5}
          fill="white"
          stroke="#9333ea"
          strokeWidth="3"
        />

        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180)
          const innerRadius = radius * 0.85
          const outerRadius = radius * 0.95
          const x1 = centerX + innerRadius * Math.cos(angle)
          const y1 = centerY + innerRadius * Math.sin(angle)
          const x2 = centerX + outerRadius * Math.cos(angle)
          const y2 = centerY + outerRadius * Math.sin(angle)

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#9333ea"
              strokeWidth="2"
            />
          )
        })}

        {/* Clock numbers */}
        {showLabels && clockNumbers.map(({ number, x, y }) => (
          <text
            key={number}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-700 font-semibold"
            fontSize={size * 0.12}
          >
            {number}
          </text>
        ))}

        {/* Hour hand */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)}
          y2={centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)}
          stroke="#9333ea"
          strokeWidth={size * 0.025}
          strokeLinecap="round"
          className="transition-transform duration-300"
        />

        {/* Minute hand */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + (radius * 0.7) * Math.sin((minuteAngle * Math.PI) / 180)}
          y2={centerY - (radius * 0.7) * Math.cos((minuteAngle * Math.PI) / 180)}
          stroke="#6b21a8"
          strokeWidth={size * 0.02}
          strokeLinecap="round"
          className="transition-transform duration-300"
        />

        {/* Center dot */}
        <circle cx={centerX} cy={centerY} r={size * 0.03} fill="#9333ea" />
      </svg>

      {/* Digital time display */}
      {(hour !== undefined || minute !== undefined) && (
        <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
          {displayHour.toString().padStart(2, '0')}:{displayMinute.toString().padStart(2, '0')}
        </div>
      )}
    </div>
  )
}
