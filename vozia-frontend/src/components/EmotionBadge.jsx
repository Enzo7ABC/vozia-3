import React from 'react'

export default function EmotionBadge({ emotion }) {
  const emotionConfig = {
    'ENOJO': { bg: 'bg-red-100', text: 'text-red-800', emoji: '😠' },
    'ALIVIO': { bg: 'bg-green-100', text: 'text-green-800', emoji: '😊' },
    'CONFUSION': { bg: 'bg-yellow-100', text: 'text-yellow-800', emoji: '😕' },
    'ANSIEDAD': { bg: 'bg-purple-100', text: 'text-purple-800', emoji: '😰' },
    'NEUTRAL': { bg: 'bg-blue-100', text: 'text-blue-800', emoji: '😐' }
  }

  // Handle both string and object formats
  const emotionStr = typeof emotion === 'string' ? emotion : emotion?.emotion || emotion?.name || 'NEUTRAL'
  const config = emotionConfig[emotionStr] || emotionConfig['NEUTRAL']

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <span>{config.emoji}</span>
      <span>{emotionStr}</span>
    </span>
  )
}
