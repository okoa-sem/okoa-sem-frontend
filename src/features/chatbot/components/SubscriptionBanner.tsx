'use client'

import { Lock, Zap, BookOpen, Brain, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface SubscriptionBannerProps {
  onSubscribe: () => void
}

export default function SubscriptionBanner({ onSubscribe }: SubscriptionBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const premiumFeatures = [
    { icon: Brain, title: 'AI Chat Bot', description: 'Unlimited access to our advanced AI study assistant' },
    { icon: BookOpen, title: 'Past Papers', description: 'Access to all past examination papers and mark schemes' },
    { icon: Zap, title: 'Fast Processing', description: 'Priority processing for instant responses' },
    { icon: Sparkles, title: 'Premium Materials', description: 'Exclusive study guides and resources' },
  ]

  return (
    <>
      <div className="bg-gradient-to-r from-primary/15 via-primary/10 to-transparent border-b-2 border-primary/30 px-6 py-4 flex items-center justify-between gap-4 flex-wrap flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white text-sm">Upgrade to Premium</div>
            <div className="text-text-gray text-xs">Unlock unlimited AI chat and study materials</div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="border-2 border-primary/50 text-primary px-4 py-2 rounded-lg font-semibold text-sm hover:border-primary hover:bg-primary/5 transition-colors"
          >
            Learn More
          </button>
          <button
            onClick={onSubscribe}
            className="bg-primary text-dark px-6 py-2 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Subscribe Now
          </button>
        </div>
      </div>

      {/* Expanded Feature Details */}
      {isExpanded && (
        <div className="bg-dark-card border-b border-dark-lighter px-6 py-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-white font-semibold mb-4">Premium Features Include:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {premiumFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="bg-black/30 border border-dark-lighter rounded-lg p-3 hover:border-primary/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-white text-sm">{feature.title}</div>
                        <div className="text-text-gray text-xs mt-1">{feature.description}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Pricing */}
            <div className="mt-4 pt-4 border-t border-dark-lighter">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-text-gray text-sm mb-1">Choose your plan:</div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-white font-bold text-lg">KSh 10</div>
                      <div className="text-text-gray text-xs">Daily (24 hours)</div>
                    </div>
                    <div className="w-px bg-dark-lighter" />
                    <div className="text-center">
                      <div className="text-white font-bold text-lg">KSh 100</div>
                      <div className="text-text-gray text-xs">Monthly (30 days)</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onSubscribe}
                  className="bg-primary text-dark px-8 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
