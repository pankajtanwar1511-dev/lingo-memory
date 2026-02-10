"use client"

interface CounterVisualProps {
  counterType: string // "人", "枚", "本", "台", etc.
  count: number
  size?: "sm" | "md" | "lg"
}

export function CounterVisual({ counterType, count, size = "md" }: CounterVisualProps) {
  // Size configurations
  const sizeConfig = {
    sm: { emoji: "text-3xl", count: "text-2xl", gap: "gap-2" },
    md: { emoji: "text-5xl", count: "text-4xl", gap: "gap-3" },
    lg: { emoji: "text-7xl", count: "text-6xl", gap: "gap-4" },
  }

  const config = sizeConfig[size]

  // Map counter types to emojis and layouts
  const getCounterVisual = () => {
    // Normalize counter type
    const normalized = counterType.toLowerCase()

    // People (人/にん)
    if (normalized.includes("人") || normalized.includes("にん") || normalized.includes("ひとり") || normalized.includes("ふたり")) {
      return {
        emoji: "👤",
        label: "People",
        arrangement: "grid",
      }
    }

    // Flat things (枚/まい)
    if (normalized.includes("枚") || normalized.includes("まい")) {
      return {
        emoji: "📄",
        label: "Flat things (paper, tickets, etc.)",
        arrangement: "stack",
      }
    }

    // Long things (本/ほん/ぽん/ぼん)
    if (normalized.includes("本") || normalized.includes("ほん") || normalized.includes("ぽん") || normalized.includes("ぼん")) {
      return {
        emoji: "🖊️",
        label: "Long things (pens, bottles, etc.)",
        arrangement: "row",
      }
    }

    // Machines/Vehicles (台/だい)
    if (normalized.includes("台") || normalized.includes("だい")) {
      return {
        emoji: "🚗",
        label: "Machines & vehicles",
        arrangement: "grid",
      }
    }

    // Cups/Glasses (杯/はい/ぱい/ばい)
    if (normalized.includes("杯") || normalized.includes("はい") || normalized.includes("ぱい") || normalized.includes("ばい")) {
      return {
        emoji: "🥤",
        label: "Cups & glasses",
        arrangement: "row",
      }
    }

    // Small animals (匹/ひき/ぴき/びき)
    if (normalized.includes("匹") || normalized.includes("ひき") || normalized.includes("ぴき") || normalized.includes("びき")) {
      return {
        emoji: "🐕",
        label: "Small animals",
        arrangement: "grid",
      }
    }

    // Large animals (頭/とう)
    if (normalized.includes("頭") || normalized.includes("とう")) {
      return {
        emoji: "🐘",
        label: "Large animals",
        arrangement: "grid",
      }
    }

    // Birds/Rabbits (羽/わ/ば/ぱ)
    if (normalized.includes("羽") || normalized.includes("わ") || normalized.includes("ば") || normalized.includes("ぱ")) {
      return {
        emoji: "🐦",
        label: "Birds & rabbits",
        arrangement: "grid",
      }
    }

    // Books (冊/さつ)
    if (normalized.includes("冊") || normalized.includes("さつ")) {
      return {
        emoji: "📚",
        label: "Books",
        arrangement: "stack",
      }
    }

    // Clothes (着/ちゃく)
    if (normalized.includes("着") || normalized.includes("ちゃく")) {
      return {
        emoji: "👕",
        label: "Clothing",
        arrangement: "row",
      }
    }

    // Shoes/Socks (足/そく/ぞく)
    if (normalized.includes("足") || normalized.includes("そく") || normalized.includes("ぞく")) {
      return {
        emoji: "👟",
        label: "Shoes & socks",
        arrangement: "grid",
      }
    }

    // Houses/Buildings (軒/けん/げん)
    if (normalized.includes("軒") || normalized.includes("けん") || normalized.includes("げん")) {
      return {
        emoji: "🏠",
        label: "Houses & buildings",
        arrangement: "grid",
      }
    }

    // Floors (階/かい/がい)
    if (normalized.includes("階") || normalized.includes("かい") || normalized.includes("がい")) {
      return {
        emoji: "🏢",
        label: "Floors",
        arrangement: "stack",
      }
    }

    // Frequency (回/かい)
    if (normalized.includes("回") && !normalized.includes("階")) {
      return {
        emoji: "🔁",
        label: "Times/frequency",
        arrangement: "row",
      }
    }

    // Age (歳/さい)
    if (normalized.includes("歳") || normalized.includes("さい")) {
      return {
        emoji: "🎂",
        label: "Age",
        arrangement: "row",
      }
    }

    // Small things (個/こ)
    if (normalized.includes("個") || normalized.includes("こ")) {
      return {
        emoji: "⚪",
        label: "Small things",
        arrangement: "grid",
      }
    }

    // General things (つ)
    if (normalized.includes("つ")) {
      return {
        emoji: "📦",
        label: "General things",
        arrangement: "grid",
      }
    }

    // Default
    return {
      emoji: "📊",
      label: "Counter",
      arrangement: "grid" as const,
    }
  }

  const visual = getCounterVisual()
  const displayCount = Math.min(count, 10) // Max 10 visual items

  // Render items based on arrangement
  const renderItems = () => {
    const items = Array.from({ length: displayCount }, (_, i) => (
      <span key={i} className={config.emoji}>
        {visual.emoji}
      </span>
    ))

    if (visual.arrangement === "grid") {
      return (
        <div className={`grid grid-cols-${Math.min(displayCount, 5)} ${config.gap} justify-center`}>
          {items}
        </div>
      )
    }

    if (visual.arrangement === "row") {
      return (
        <div className={`flex ${config.gap} justify-center flex-wrap`}>
          {items}
        </div>
      )
    }

    if (visual.arrangement === "stack") {
      return (
        <div className="relative flex justify-center items-end" style={{ height: `${displayCount * 20 + 60}px` }}>
          {items.map((item, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                bottom: `${i * 8}px`,
                left: `calc(50% - ${i * 2}px)`,
                transform: 'translateX(-50%)',
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )
    }

    return items
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-lg">
      {/* Count display */}
      <div className={`${config.count} font-bold text-purple-700 dark:text-purple-300`}>
        {count}
      </div>

      {/* Visual items */}
      <div className="flex justify-center items-center min-h-[80px]">
        {renderItems()}
      </div>

      {/* Counter type label */}
      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
        {visual.label}
      </div>

      {/* Show "+" if more than 10 */}
      {count > 10 && (
        <div className="text-xs text-gray-500 dark:text-gray-500">
          (showing first 10)
        </div>
      )}
    </div>
  )
}
