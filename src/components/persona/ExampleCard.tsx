/**
 * ExampleCard Component
 *
 * Displays a single example sentence with persona attribution,
 * badges, and optional validation info
 */

import React from 'react'
import { Example } from '@/types/vocabulary'
import { Persona } from '@/types/persona'
import { PersonaAvatar } from './PersonaAvatar'
import { PersonaBadge } from './PersonaBadge'

interface ExampleCardProps {
  example: Example
  persona?: Persona
  showValidation?: boolean
  className?: string
}

export function ExampleCard({
  example,
  persona,
  showValidation = false,
  className = ''
}: ExampleCardProps) {
  const isGenerated = example.source.type === 'generated'
  const needsReview = example.needsReview === true

  // Get persona color for theming
  const getPersonaColor = () => {
    if (!persona) return 'border-gray-300'
    const colorMap: Record<string, string> = {
      'persona_tomoko': 'border-pink-400 hover:border-pink-500',
      'persona_ken': 'border-blue-400 hover:border-blue-500',
      'persona_aya': 'border-purple-400 hover:border-purple-500',
      'persona_emi': 'border-orange-400 hover:border-orange-500',
    }
    return colorMap[persona.id] || 'border-blue-400 hover:border-blue-500'
  }

  return (
    <div className={`relative bg-white rounded-xl p-5 shadow-md border-l-4 ${getPersonaColor()} ${className} animate-scale-in transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}>
      {/* Header: Avatar + Badges */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        {/* Left: Avatar */}
        {persona && (
          <PersonaAvatar persona={persona} size="sm" showName />
        )}

        {/* Right: Badges */}
        <div className="flex gap-1.5 ml-auto">
          <PersonaBadge type="source" status={example.source.type} />
          {needsReview && <PersonaBadge type="review" status="needs_review" />}
          {example.validation && example.validation.autoScore && example.validation.autoScore >= 0.8 && (
            <PersonaBadge type="validation" status="passed" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">

        {/* Japanese Sentence */}
        <div className="mb-3">
          <div className="text-2xl font-bold text-gray-900 leading-relaxed font-japanese tracking-wide">
            {example.japanese}
          </div>
        </div>

        {/* Kana Reading */}
        {example.kana && (
          <div className="text-sm text-gray-600 font-japanese">
            {example.kana}
          </div>
        )}

        {/* English Translation */}
        <div className="text-base text-gray-700 italic">
          "{example.english}"
        </div>
      </div>

      {/* Validation Info (Optional) */}
      {showValidation && example.validation && (
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center gap-3 text-xs text-gray-600">
            {example.validation.tokenMatch && (
              <span className="flex items-center gap-1 text-green-600">
                <span>✓</span> Token Match
              </span>
            )}
            {example.validation.kanaMatch && (
              <span className="flex items-center gap-1 text-green-600">
                <span>✓</span> Kana OK
              </span>
            )}
            {example.validation.lengthOk && (
              <span className="flex items-center gap-1 text-green-600">
                <span>✓</span> Length OK
              </span>
            )}
            {example.validation.autoScore && (
              <span className="ml-auto font-semibold text-indigo-600">
                Score: {example.validation.autoScore.toFixed(2)}
              </span>
            )}
          </div>

          {example.validation.issues && example.validation.issues.length > 0 && (
            <div className="mt-2 text-xs text-orange-600">
              ⚠ {example.validation.issues.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Audio Player Placeholder (Future) */}
      {example.audioUrl && (
        <div className="mt-3">
          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>🔊</span> Play Audio
          </button>
        </div>
      )}
    </div>
  )
}
