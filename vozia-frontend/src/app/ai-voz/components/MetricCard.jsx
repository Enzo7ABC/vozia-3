import React from 'react'

export default function MetricCard({ label, value, icon, className = '' }) {
  return (
    <div className={`rounded-lg p-4 flex items-center justify-between ${className}`}>
      <div>
        <p className="text-xs font-semibold opacity-75 mb-1">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-3xl opacity-50">
        {icon}
      </div>
    </div>
  )
}
