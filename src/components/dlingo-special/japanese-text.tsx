/**
 * Component for displaying Japanese text with formatted multiple readings
 * Converts "なな/しち" to "なな / しち" with styled separator
 */

interface JapaneseTextProps {
  text: string
  className?: string
}

export function JapaneseText({ text, className = "" }: JapaneseTextProps) {
  // Check if text contains multiple readings (/)
  if (!text.includes("/")) {
    return <span className={className}>{text}</span>
  }

  // Split by slash and format with styled separator
  const parts = text.split("/")

  return (
    <span className={className}>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && (
            <span className="text-black dark:text-white opacity-40 mx-1.5 font-normal">
              /
            </span>
          )}
        </span>
      ))}
    </span>
  )
}
