'use client'

import { Gem, AlertTriangle, History } from 'lucide-react'
import { UserSubscription } from '@/types'

interface SubscriptionCardProps {
  subscription: UserSubscription
  onViewHistory?: () => void
}

export default function SubscriptionCard({ subscription, onViewHistory }: SubscriptionCardProps) {
  return (
    <div className="bg-dark-card border border-dark-lighter rounded-2xl p-6 h-fit">
      <h3 className="text-lg font-semibold text-white mb-5">Subscription</h3>

      {/* Current Plan */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
          <Gem className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-text-gray text-xs mb-0.5">Current Plan</p>
          <p className="text-white font-medium">
            {subscription.isActive && subscription.plan
              ? subscription.plan.name
              : 'No Active Plan'}
          </p>
        </div>
      </div>

      {/* Alert */}
      {!subscription.isActive && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-5 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-400 text-sm">
            Subscribe to unlock all features
          </p>
        </div>
      )}

      {/* Active Subscription Info */}
      {subscription.isActive && subscription.expiresAt && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-5">
          <p className="text-green-400 text-sm">
            Expires on{' '}
            {new Date(subscription.expiresAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}

      {/* View History Button */}
      <button
        onClick={onViewHistory}
        className="w-full py-2.5 px-4 bg-dark-lighter rounded-xl text-white text-sm font-medium hover:bg-dark-lighter/80 transition-all flex items-center justify-center gap-2"
      >
        <History className="w-4 h-4" />
        <span>Payment History</span>
      </button>
    </div>
  )
}

