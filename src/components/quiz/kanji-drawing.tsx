"use client"

import { useEffect, useRef, useState } from "react"
import Atrament from "atrament"
import { Button } from "@/components/ui/button"
import { RotateCcw, Eraser, Eye, EyeOff } from "lucide-react"

interface KanjiDrawingProps {
  kanji: string
  svgPath: string
  strokeCount: number
  onReadings?: string[]
  kunReadings?: string[]
  onSubmit: (strokes: DrawnStroke[], isCorrect: boolean) => void
  disabled?: boolean
  showReference?: boolean
}

interface DrawnStroke {
  points: { x: number; y: number }[]
  timestamp: number
  isCorrect?: boolean // Validation status
  wasCorrected?: boolean // Whether it was auto-corrected
}

interface ReferenceStroke {
  path: string
  order: number
  bounds?: { minX: number; minY: number; maxX: number; maxY: number } // Bounding box for validation
}

// Parse SVG path to get bounding box
const parseSVGPathBounds = (pathString: string): { minX: number; minY: number; maxX: number; maxY: number } => {
  // Simple path parser - extracts M (move) and L (line) commands
  const commands = pathString.match(/[MLCQmlcq][^MLCQmlcq]*/g) || []
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

  commands.forEach(cmd => {
    const type = cmd[0]
    const coords = cmd.slice(1).trim().split(/[\s,]+/).map(Number)

    for (let i = 0; i < coords.length; i += 2) {
      const x = coords[i]
      const y = coords[i + 1]
      if (!isNaN(x) && !isNaN(y)) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }
  })

  return { minX, minY, maxX, maxY }
}

/**
 * KanjiDrawing Component
 *
 * Allows users to draw kanji character with stroke order validation
 * Uses Atrament.js for smooth drawing and KanjiVG SVG for reference
 */
export function KanjiDrawing({
  kanji,
  svgPath,
  strokeCount,
  onReadings = [],
  kunReadings = [],
  onSubmit,
  disabled = false,
  showReference: showReferenceProp = false
}: KanjiDrawingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const atramentRef = useRef<Atrament | null>(null)
  const [drawnStrokes, setDrawnStrokes] = useState<DrawnStroke[]>([])
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([])
  const [referenceStrokes, setReferenceStrokes] = useState<ReferenceStroke[]>([])
  const [showReference, setShowReference] = useState(showReferenceProp)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0)
  const [wrongStroke, setWrongStroke] = useState(false)
  const [isLoadingSVG, setIsLoadingSVG] = useState(true)
  const [showStrokeGuide, setShowStrokeGuide] = useState(true) // Show guide for current stroke

  // Sample points from SVG path data
  const samplePathPoints = (pathData: string, numSamples: number = 20): { x: number; y: number }[] => {
    // Create a temporary SVG to measure the path
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', pathData)
    svg.appendChild(path)
    document.body.appendChild(svg)

    const pathLength = path.getTotalLength()
    const points: { x: number; y: number }[] = []

    // Sample points along the path
    for (let i = 0; i <= numSamples; i++) {
      const distance = (i / numSamples) * pathLength
      const point = path.getPointAtLength(distance)
      // Scale from SVG viewBox (109x109) to canvas (300x300)
      const scale = 300 / 109
      points.push({ x: point.x * scale, y: point.y * scale })
    }

    document.body.removeChild(svg)
    return points
  }

  // Calculate stroke direction (start to end vector)
  const getStrokeDirection = (points: { x: number; y: number }[]): { dx: number; dy: number } => {
    if (points.length < 2) return { dx: 0, dy: 0 }

    const start = points[0]
    const end = points[points.length - 1]
    const dx = end.x - start.x
    const dy = end.y - start.y
    const magnitude = Math.sqrt(dx * dx + dy * dy)

    return magnitude > 0 ? { dx: dx / magnitude, dy: dy / magnitude } : { dx: 0, dy: 0 }
  }

  // Validate a drawn stroke against the expected reference stroke using DTW
  const validateStroke = (points: { x: number; y: number }[], strokeIndex: number): boolean => {
    if (strokeIndex >= referenceStrokes.length || points.length < 3) {
      return false
    }

    const expectedStroke = referenceStrokes[strokeIndex]
    if (!expectedStroke.bounds) {
      return false
    }

    // Sample reference path points
    let refPoints
    try {
      refPoints = samplePathPoints(expectedStroke.path, 20)
    } catch (error) {
      console.error('Error sampling path:', error)
      return false
    }

    // Calculate reference stroke size for tolerance
    const refWidth = (expectedStroke.bounds.maxX - expectedStroke.bounds.minX) * (300 / 109)
    const refHeight = (expectedStroke.bounds.maxY - expectedStroke.bounds.minY) * (300 / 109)
    const refSize = Math.max(refWidth, refHeight, 30) // Minimum 30px

    // 1. Start point check (relaxed for better UX)
    const startDist = Math.sqrt(
      Math.pow(points[0].x - refPoints[0].x, 2) +
      Math.pow(points[0].y - refPoints[0].y, 2)
    )
    const startTolerance = refSize * 0.6 // 60% of stroke size - user-friendly
    if (startDist > startTolerance) {
      return false
    }

    // 2. End point check (relaxed for better UX)
    const endDist = Math.sqrt(
      Math.pow(points[points.length - 1].x - refPoints[refPoints.length - 1].x, 2) +
      Math.pow(points[points.length - 1].y - refPoints[refPoints.length - 1].y, 2)
    )
    const endTolerance = refSize * 0.6 // 60% of stroke size - user-friendly
    if (endDist > endTolerance) {
      return false
    }

    // 3. DTW-based path matching with relaxed thresholds
    const dtwDistance = calculateDTW(points, refPoints)
    const pathLength = points.length + refPoints.length
    const normalizedDTW = dtwDistance / pathLength

    // More lenient thresholds for better user experience
    const strokeAspectRatio = refWidth / refHeight
    const isVerticalOrDiagonal = strokeAspectRatio < 0.5 || strokeAspectRatio > 2.0

    let dtwThreshold: number
    if (isVerticalOrDiagonal) {
      dtwThreshold = 35 // More lenient for vertical/diagonal (harder to draw)
    } else {
      dtwThreshold = 30 // Lenient for horizontal strokes
    }

    if (normalizedDTW > dtwThreshold) {
      return false
    }

    // 4. Very lenient direction check - only reject completely opposite direction
    const drawnDir = getStrokeDirection(points)
    const refDir = getStrokeDirection(refPoints)
    const dotProduct = drawnDir.dx * refDir.dx + drawnDir.dy * refDir.dy

    // Allow up to 100° deviation
    if (dotProduct < -0.2) {
      return false
    }

    return true
  }

  // Dynamic Time Warping - industry standard for stroke matching
  // Handles variations in drawing speed, slight deviations, and different styles
  const calculateDTW = (
    seq1: { x: number; y: number }[],
    seq2: { x: number; y: number }[]
  ): number => {
    const n = seq1.length
    const m = seq2.length

    // Create DTW matrix
    const dtw: number[][] = Array(n + 1).fill(null).map(() => Array(m + 1).fill(Infinity))
    dtw[0][0] = 0

    // Fill DTW matrix
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const cost = Math.sqrt(
          Math.pow(seq1[i - 1].x - seq2[j - 1].x, 2) +
          Math.pow(seq1[i - 1].y - seq2[j - 1].y, 2)
        )

        // Take minimum of three possible paths
        dtw[i][j] = cost + Math.min(
          dtw[i - 1][j],     // insertion
          dtw[i][j - 1],     // deletion
          dtw[i - 1][j - 1]  // match
        )
      }
    }

    return dtw[n][m]
  }

  // Calculate total stroke length
  const calculateStrokeLength = (points: { x: number; y: number }[]): number => {
    let length = 0
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x
      const dy = points[i].y - points[i - 1].y
      length += Math.sqrt(dx * dx + dy * dy)
    }
    return length
  }

  // Draw reference stroke on overlay canvas (dark, permanent)
  const drawReferenceStroke = (strokeIndex: number) => {
    if (!overlayCanvasRef.current || strokeIndex >= referenceStrokes.length) return

    const overlayCanvas = overlayCanvasRef.current
    const ctx = overlayCanvas.getContext('2d')
    if (!ctx) return

    const stroke = referenceStrokes[strokeIndex]
    const path = new Path2D(stroke.path)

    // Scale from SVG viewBox (109x109) to canvas (300x300)
    const scale = 300 / 109
    ctx.save()
    ctx.scale(scale, scale)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 8 / scale
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke(path)
    ctx.restore()
  }

  // Draw stroke guide on overlay canvas (light gray, shows where to draw)
  const drawStrokeGuide = (strokeIndex: number) => {
    if (!overlayCanvasRef.current || strokeIndex >= referenceStrokes.length) return

    const overlayCanvas = overlayCanvasRef.current
    const ctx = overlayCanvas.getContext('2d')
    if (!ctx) return

    // Clear previous guide
    ctx.clearRect(0, 0, 300, 300)

    // Redraw all completed strokes first
    for (let i = 0; i < strokeIndex; i++) {
      const stroke = referenceStrokes[i]
      const path = new Path2D(stroke.path)
      const scale = 300 / 109
      ctx.save()
      ctx.scale(scale, scale)
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 8 / scale
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke(path)
      ctx.restore()
    }

    // Draw current stroke guide in light gray
    const stroke = referenceStrokes[strokeIndex]
    const path = new Path2D(stroke.path)
    const scale = 300 / 109
    ctx.save()
    ctx.scale(scale, scale)
    ctx.strokeStyle = '#D1D5DB' // Light gray
    ctx.lineWidth = 8 / scale
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke(path)
    ctx.restore()
  }

  // Clear the user's current stroke only (not the whole canvas)
  const clearCurrentStroke = () => {
    if (!atramentRef.current) return

    // Atrament doesn't support undoing just the last stroke
    // So we need to clear and redraw all correct strokes from overlay
    atramentRef.current.clear()
  }

  // Initialize Atrament canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const atrament = new Atrament(canvas, {
      width: 300,
      height: 300,
      color: "#000000",
      weight: 8,
      smoothing: 1.5,
      adaptiveStroke: true,
    })

    atramentRef.current = atrament

    // Disable/enable drawing based on state
    atrament.disabled = disabled || hasSubmitted || isLoadingSVG

    // Track strokes using mouse/pointer events
    let isDrawing = false
    let currentPoints: { x: number; y: number }[] = []

    const handlePointerDown = (e: PointerEvent) => {
      if (disabled || hasSubmitted || atrament.disabled) return
      isDrawing = true
      currentPoints = []
      const rect = canvas.getBoundingClientRect()
      currentPoints.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDrawing || disabled || hasSubmitted) return
      const rect = canvas.getBoundingClientRect()
      currentPoints.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }

    const handlePointerUp = () => {
      if (!isDrawing || disabled || hasSubmitted) return
      isDrawing = false

      // Add stroke to list with actual points
      if (currentPoints.length > 0) {
        // Validate this stroke against the expected stroke
        const expectedStrokeIndex = drawnStrokes.filter(s => s.isCorrect).length
        const isValid = validateStroke(currentPoints, expectedStrokeIndex)

        if (isValid) {
          // Stroke is correct!
          // Clear the user's drawn stroke and replace with perfect reference stroke
          setTimeout(() => {
            clearCurrentStroke()
            drawReferenceStroke(expectedStrokeIndex)
          }, 100)

          const newStroke: DrawnStroke = {
            points: currentPoints,
            timestamp: Date.now(),
            isCorrect: true,
            wasCorrected: true
          }

          setDrawnStrokes(prev => [...prev, newStroke])
          setWrongStroke(false)

          // Check if all strokes are complete
          if (expectedStrokeIndex + 1 === referenceStrokes.length) {
            // All strokes complete!
            setTimeout(() => {
              setHasSubmitted(true)
              setIsCorrect(true)
              onSubmit([...drawnStrokes, newStroke], true)
            }, 500)
          }
        } else {
          // Wrong stroke - show feedback and clear just this stroke
          setWrongStroke(true)
          setTimeout(() => {
            clearCurrentStroke()
            setWrongStroke(false)
          }, 800)
        }

        setCurrentStroke([])
        currentPoints = []
      }
    }

    // Listen to pointer events
    canvas.addEventListener("pointerdown", handlePointerDown)
    canvas.addEventListener("pointermove", handlePointerMove)
    canvas.addEventListener("pointerup", handlePointerUp)
    canvas.addEventListener("pointerleave", handlePointerUp)

    // Disable context menu
    canvas.addEventListener("contextmenu", (e) => e.preventDefault())

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown)
      canvas.removeEventListener("pointermove", handlePointerMove)
      canvas.removeEventListener("pointerup", handlePointerUp)
      canvas.removeEventListener("pointerleave", handlePointerUp)
      atrament.destroy?.()
    }
  }, [disabled, hasSubmitted, isLoadingSVG, drawnStrokes, referenceStrokes])

  // Draw guide for current stroke
  useEffect(() => {
    if (!showStrokeGuide || isLoadingSVG || hasSubmitted || referenceStrokes.length === 0) {
      return
    }

    const currentStroke = drawnStrokes.filter(s => s.isCorrect).length
    if (currentStroke < referenceStrokes.length) {
      drawStrokeGuide(currentStroke)
    }
  }, [showStrokeGuide, isLoadingSVG, hasSubmitted, referenceStrokes, drawnStrokes])

  // Load and parse SVG reference strokes
  useEffect(() => {
    if (!svgPath) {
      setIsLoadingSVG(false)
      return
    }

    setIsLoadingSVG(true)
    setReferenceStrokes([]) // Clear previous strokes

    const abortController = new AbortController()
    let isMounted = true

    const loadSVG = async () => {
      try {
        const response = await fetch(svgPath, { signal: abortController.signal })

        if (!response.ok) {
          if (isMounted) setIsLoadingSVG(false)
          return
        }

        const svgText = await response.text()
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml")
        const paths = svgDoc.querySelectorAll('path[id^="kvg"]')

        const strokes: ReferenceStroke[] = Array.from(paths).map((path, index) => {
          const pathData = path.getAttribute("d") || ""
          return {
            path: pathData,
            order: index + 1,
            bounds: parseSVGPathBounds(pathData)
          }
        })

        if (isMounted) {
          setReferenceStrokes(strokes)
          setIsLoadingSVG(false)

          // Draw the first stroke guide immediately
          setTimeout(() => {
            if (overlayCanvasRef.current && strokes.length > 0) {
              const ctx = overlayCanvasRef.current.getContext('2d')
              if (ctx) {
                ctx.clearRect(0, 0, 300, 300)
                const path = new Path2D(strokes[0].path)
                const scale = 300 / 109
                ctx.save()
                ctx.scale(scale, scale)
                ctx.strokeStyle = '#D1D5DB' // Light gray
                ctx.lineWidth = 8 / scale
                ctx.lineCap = 'round'
                ctx.lineJoin = 'round'
                ctx.stroke(path)
                ctx.restore()
              }
            }
          }, 100)
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("SVG loading error:", error)
        }
        if (isMounted) setIsLoadingSVG(false)
      }
    }

    loadSVG()

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [svgPath])

  const handleClear = () => {
    if (atramentRef.current) {
      atramentRef.current.clear()
    }
    // Clear overlay canvas
    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, 300, 300)
      }
    }
    setDrawnStrokes([])
    setCurrentStroke([])
    setHasSubmitted(false)
    setIsCorrect(false)
    setWrongStroke(false)
  }

  const handleUndo = () => {
    if (drawnStrokes.length === 0) return

    // Remove last correct stroke
    const newStrokes = drawnStrokes.slice(0, -1)
    setDrawnStrokes(newStrokes)

    // Clear both canvases
    if (atramentRef.current) {
      atramentRef.current.clear()
    }
    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, 300, 300)
      }
    }

    // Redraw remaining correct strokes on overlay
    newStrokes.forEach((_, index) => {
      drawReferenceStroke(index)
    })
  }

  const handleToggleReference = () => {
    setShowStrokeGuide(!showStrokeGuide)
    if (!showStrokeGuide) {
      // If turning guide on, redraw it
      const currentStroke = drawnStrokes.filter(s => s.isCorrect).length
      if (currentStroke < referenceStrokes.length) {
        drawStrokeGuide(currentStroke)
      }
    } else {
      // If turning guide off, clear overlay and redraw completed strokes only
      if (overlayCanvasRef.current) {
        const ctx = overlayCanvasRef.current.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, 300, 300)
          // Redraw completed strokes
          const completed = drawnStrokes.filter(s => s.isCorrect).length
          for (let i = 0; i < completed; i++) {
            drawReferenceStroke(i)
          }
        }
      }
    }
  }

  // Manual fallback: Try to draw guide after any state change
  const attemptDrawGuide = () => {
    if (!showStrokeGuide || isLoadingSVG || hasSubmitted || referenceStrokes.length === 0) {
      return
    }

    const currentStroke = drawnStrokes.filter(s => s.isCorrect).length

    if (currentStroke < referenceStrokes.length && overlayCanvasRef.current) {
      drawStrokeGuide(currentStroke)
    }
  }

  // Try to draw guide whenever reference strokes are available
  if (referenceStrokes.length > 0 && !isLoadingSVG && !hasSubmitted) {
    attemptDrawGuide()
  }

  return (
    <div className="space-y-4">
      {/* Canvas Container */}
      <div className="relative mx-auto w-fit">
        {/* Reference SVG overlay (optional) */}
        {showReference && (
          <div className="absolute inset-0 pointer-events-none opacity-30 z-10">
            <img
              src={svgPath}
              alt={`${kanji} stroke order`}
              className="w-full h-full"
            />
          </div>
        )}

        {/* Drawing Canvas */}
        <div className="relative border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
          {/* Overlay canvas for guides and reference strokes (behind user drawing) */}
          <canvas
            ref={overlayCanvasRef}
            width={300}
            height={300}
            className="absolute inset-0 pointer-events-none z-0"
          />

          {/* User drawing canvas (on top) */}
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className={`relative z-10 ${disabled || hasSubmitted ? "cursor-not-allowed opacity-60" : "cursor-crosshair"}`}
          />

          {/* Grid lines (optional) */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width="300"
            height="300"
            viewBox="0 0 300 300"
          >
            {/* Center guides */}
            <line x1="150" y1="0" x2="150" y2="300" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="0" y1="150" x2="300" y2="150" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
          </svg>

          {/* Loading overlay */}
          {isLoadingSVG && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-20">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading strokes...</p>
              </div>
            </div>
          )}

              {/* Stroke progress indicator */}
          {!hasSubmitted && (
            <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-medium border border-gray-200 dark:border-gray-700">
              Stroke {drawnStrokes.filter(s => s.isCorrect).length + 1} / {referenceStrokes.length}
            </div>
          )}

          {/* Wrong stroke indicator */}
          {wrongStroke && (
            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center animate-pulse">
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
                Wrong stroke! Try again
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Readings - Always visible */}
      {(onReadings.length > 0 || kunReadings.length > 0) && (
        <div className="text-sm text-muted-foreground text-center space-x-4 mb-4">
          {onReadings.length > 0 && (
            <span className="inline-block">
              <span className="font-semibold">音:</span> {onReadings.join(", ")}
            </span>
          )}
          {kunReadings.length > 0 && (
            <span className="inline-block">
              <span className="font-semibold">訓:</span> {kunReadings.join(", ")}
            </span>
          )}
        </div>
      )}

      {/* Feedback */}
      {hasSubmitted && (
        <div className="space-y-2">
          <div className={`text-center p-3 rounded-lg ${
            isCorrect
              ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300"
              : "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300"
          }`}>
            <p className="font-semibold">
              {isCorrect
                ? "Correct! 正解です！"
                : `Try again! You drew ${drawnStrokes.length} strokes, expected ${referenceStrokes.length}`
              }
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 justify-center flex-wrap">
        {!hasSubmitted && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={disabled || drawnStrokes.length === 0}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={disabled || drawnStrokes.length === 0}
              className="gap-2"
            >
              <Eraser className="h-4 w-4" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleReference}
              disabled={disabled}
              className="gap-2"
            >
              {showStrokeGuide ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showStrokeGuide ? "Hide" : "Show"} Stroke Guide
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
