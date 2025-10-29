/**
 * PersonaAvatar Component
 *
 * Clean, simple avatar with emoji and name
 */

import React from 'react'
import { Persona } from '@/types/persona'

interface PersonaAvatarProps {
  persona: Persona
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  className?: string
}

const PERSONA_STYLES: Record<string, {
  bgGradient: string
  emoji: string
  accentColor: string
}> = {
  persona_tomoko: {
    bgGradient: 'from-pink-400 to-pink-600',
    emoji: '👧',
    accentColor: 'text-pink-600'
  },
  persona_ken: {
    bgGradient: 'from-blue-400 to-blue-600',
    emoji: '👨',
    accentColor: 'text-blue-600'
  },
  persona_aya: {
    bgGradient: 'from-purple-400 to-purple-600',
    emoji: '👩',
    accentColor: 'text-purple-600'
  },
  persona_emi: {
    bgGradient: 'from-orange-400 to-orange-600',
    emoji: '👵',
    accentColor: 'text-orange-600'
  },
}

const SIZE_CONFIG = {
  sm: {
    container: 'w-10 h-10',
    emoji: 'text-xl'
  },
  md: {
    container: 'w-14 h-14',
    emoji: 'text-2xl'
  },
  lg: {
    container: 'w-16 h-16',
    emoji: 'text-3xl'
  },
}

export function PersonaAvatar({
  persona,
  size = 'md',
  showName = false,
  className = ''
}: PersonaAvatarProps) {
  const style = PERSONA_STYLES[persona.id] || PERSONA_STYLES.persona_ken
  const sizeConfig = SIZE_CONFIG[size]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Avatar Circle */}
      <div
        className={`
          ${sizeConfig.container} rounded-full
          bg-gradient-to-br ${style.bgGradient}
          border-2 border-white shadow-md
          flex items-center justify-center
          transition-transform duration-200
          hover:scale-105
        `}
        title={`${persona.name} - ${persona.role}`}
      >
        <span className={`${sizeConfig.emoji}`}>
          {style.emoji}
        </span>
      </div>

      {/* Name */}
      {showName && (
        <span className={`text-sm font-semibold ${style.accentColor}`}>
          {persona.name}
        </span>
      )}
    </div>
  )
}
