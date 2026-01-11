'use client'

import { FileText, Search, Users } from 'lucide-react'

const FEATURES = [
  { label: 'Past Papers', id: 'papers', icon: FileText },
  { label: 'Smart Search', id: 'search', icon: Search },
  { label: 'Study Groups', id: 'groups', icon: Users },
]

export default function FeatureBadges() {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {FEATURES.map((feature) => {
        const Icon = feature.icon
        return (
          <div
            key={feature.id}
            className="bg-primary/10 border border-primary/30 text-primary px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 hover:bg-primary hover:text-dark hover:border-primary cursor-pointer"
          >
            <Icon className="w-3.5 h-3.5" />
            {feature.label}
          </div>
        )
      })}
    </div>
  )
}
