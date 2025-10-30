'use client';

/**
 * Stroke Order Animation Component
 *
 * Displays animated SVG stroke order for kanji characters.
 * Uses Framer Motion for smooth sequential stroke animations.
 *
 * Features:
 * - Play/pause/reset controls
 * - Adjustable speed (0.5x, 1x, 2x)
 * - Loop mode
 * - Stroke number display
 * - Mobile responsive
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KanjiStrokes } from '@/types/kanji';

interface StrokeOrderAnimationProps {
  kanji: string;
  strokes: KanjiStrokes;
  autoPlay?: boolean;
  speed?: number;           // 0.5, 1.0, 2.0
  showStrokeNumbers?: boolean;
  loop?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function StrokeOrderAnimation({
  kanji,
  strokes,
  autoPlay = false,
  speed = 1.0,
  showStrokeNumbers = true,
  loop = false,
  onComplete,
  className = '',
}: StrokeOrderAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentStroke, setCurrentStroke] = useState(0);
  const [isLooping, setIsLooping] = useState(loop);
  const [playbackSpeed, setPlaybackSpeed] = useState(speed);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [strokePaths, setStrokePaths] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load SVG file and parse stroke paths
  useEffect(() => {
    const loadSVG = async () => {
      try {
        const response = await fetch(strokes.svgPath);
        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${response.statusText}`);
        }
        const svgText = await response.text();
        setSvgContent(svgText);

        // Parse SVG to extract path elements
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const paths = Array.from(svgDoc.querySelectorAll('path'));
        const pathData = paths.map(path => path.getAttribute('d') || '');

        setStrokePaths(pathData);
        setError(null);
      } catch (err) {
        console.error('Error loading SVG:', err);
        setError('Failed to load stroke order diagram');
      }
    };

    loadSVG();
  }, [strokes.svgPath]);

  // Animation timing
  const strokeDuration = 800 / playbackSpeed;  // Base 800ms per stroke
  const pauseBetweenStrokes = 300 / playbackSpeed;

  // Auto-play animation loop
  useEffect(() => {
    if (!isPlaying || strokePaths.length === 0) return;

    const timer = setTimeout(() => {
      if (currentStroke < strokePaths.length - 1) {
        setCurrentStroke(prev => prev + 1);
      } else {
        // Animation complete
        if (isLooping) {
          setCurrentStroke(0);  // Restart
        } else {
          setIsPlaying(false);
          onComplete?.();
        }
      }
    }, strokeDuration + pauseBetweenStrokes);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStroke, strokePaths.length, strokeDuration, pauseBetweenStrokes, isLooping, onComplete]);

  // Control handlers
  const handlePlayPause = () => {
    if (!isPlaying && currentStroke >= strokePaths.length - 1) {
      // If finished, reset and play
      setCurrentStroke(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStroke(0);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const cycleSpeed = () => {
    const speeds = [0.5, 1.0, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!svgContent || strokePaths.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* SVG Animation Container */}
      <div
        ref={containerRef}
        className="relative bg-background border-2 border-border rounded-lg p-4 aspect-square flex items-center justify-center"
      >
        <svg
          viewBox="0 0 109 109"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Grid background (optional) */}
          <g opacity="0.1" stroke="#000" strokeWidth="0.5">
            <line x1="0" y1="54.5" x2="109" y2="54.5" />
            <line x1="54.5" y1="0" x2="54.5" y2="109" />
          </g>

          {/* Render strokes up to current stroke */}
          {strokePaths.map((pathData, index) => {
            if (index > currentStroke) return null;

            const isCurrentStroke = index === currentStroke;

            return (
              <motion.path
                key={index}
                d={pathData}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: isCurrentStroke && isPlaying ? 1 : 1,
                  opacity: 1,
                }}
                transition={{
                  pathLength: {
                    duration: strokeDuration / 1000,
                    ease: 'easeInOut',
                  },
                  opacity: { duration: 0.1 },
                }}
              />
            );
          })}

          {/* Stroke numbers */}
          {showStrokeNumbers && strokePaths.map((_, index) => {
            if (index > currentStroke) return null;

            return (
              <text
                key={`num-${index}`}
                x="10"
                y={20 + index * 12}
                fontSize="10"
                fill="currentColor"
                className="text-muted-foreground opacity-50"
              >
                {index + 1}
              </text>
            );
          })}
        </svg>

        {/* Stroke count indicator */}
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
          {currentStroke + 1} / {strokePaths.length}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Play/Pause */}
        <Button
          onClick={handlePlayPause}
          variant="default"
          size="sm"
          className="gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              {currentStroke >= strokePaths.length - 1 ? 'Replay' : 'Play'}
            </>
          )}
        </Button>

        {/* Reset */}
        <Button onClick={handleReset} variant="outline" size="sm" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>

        {/* Loop */}
        <Button
          onClick={toggleLoop}
          variant={isLooping ? 'default' : 'outline'}
          size="sm"
          className="gap-2"
        >
          <Repeat className="h-4 w-4" />
          Loop
        </Button>

        {/* Speed */}
        <Button onClick={cycleSpeed} variant="outline" size="sm">
          Speed: {playbackSpeed}x
        </Button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-300"
          style={{
            width: `${((currentStroke + 1) / strokePaths.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
