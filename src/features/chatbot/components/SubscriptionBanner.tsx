'use client'

import { AlertTriangle } from 'lucide-react'

interface SubscriptionBannerProps {
  onSubscribe: () => void
}

export default function SubscriptionBanner({ onSubscribe }: SubscriptionBannerProps) {
  return (
    <div className="bg-gradient-to-r from-yellow-500/[0.15] to-orange-500/10 border-b border-yellow-500/30 px-8 py-3.5 flex items-center justify-between gap-4 flex-wrap flex-shrink-0">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-[#FFC107]" />
        <span className="text-[#FFC107] font-semibold text-[15px]">
          No active subscription
        </span>
      </div>
      <button
        onClick={onSubscribe}
        className="bg-primary text-dark px-6 py-2 rounded-lg font-semibold text-[15px] hover:bg-primary-dark transition-colors"
      >
        Subscribe
      </button>
    </div>
  )
}
