/**
 * PersonaBadge Component
 *
 * Status badges for examples (Generated, Authentic, Needs Review, etc.)
 */

import React from 'react'
import { ExampleSourceType } from '@/types/vocabulary'

interface PersonaBadgeProps {
  type: 'source' | 'review' | 'validation'
  status: string
  className?: string
}

const BADGE_STYLES = {
  source: {
    generated: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-300 shadow-sm',
    authentic: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300 shadow-sm',
    tatoeba: 'bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 border-teal-300 shadow-sm',
    jmdict: 'bg-gradient-to-r from-lime-100 to-green-100 text-lime-700 border-lime-300 shadow-sm',
    custom: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300 shadow-sm',
  },
  review: {
    approved: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300 shadow-sm',
    needs_review: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border-yellow-300 shadow-sm',
    rejected: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-300 shadow-sm',
  },
  validation: {
    passed: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-300 shadow-sm',
    failed: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-300 shadow-sm',
    warning: 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-300 shadow-sm',
  },
}

const BADGE_LABELS = {
  source: {
    generated: '✨ Generated',
    authentic: '🌟 Authentic',
    tatoeba: '📚 Tatoeba',
    jmdict: '📖 JMdict',
    custom: '✏️ Custom',
  },
  review: {
    approved: '✅ Approved',
    needs_review: '⏳ Review',
    rejected: '❌ Rejected',
  },
  validation: {
    passed: '✓ Validated',
    failed: '✗ Failed',
    warning: '⚠ Warning',
  },
}

export function PersonaBadge({ type, status, className = '' }: PersonaBadgeProps) {
  const styleKey = status as keyof typeof BADGE_STYLES[typeof type]
  const styles = BADGE_STYLES[type] as any
  const labels = BADGE_LABELS[type] as any
  const style = styles?.[styleKey] || styles?.custom || 'bg-gray-100 text-gray-700'
  const label = labels?.[styleKey] || status

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border-2 ${style} ${className} animate-fade-in-up transition-all duration-200 hover:scale-110 hover:shadow-md cursor-default`}
    >
      {label}
    </span>
  )
}
