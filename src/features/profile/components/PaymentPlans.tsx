'use client'

import { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'
import { SubscriptionPlan } from '@/types'

interface PaymentPlansProps {
  plans: SubscriptionPlan[]
  onSelectPlan?: (plan: SubscriptionPlan) => void
}

export default function PaymentPlans({ plans, onSelectPlan }: PaymentPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan.id)
    const confirmMessage = `Subscribe to ${plan.name} (KSh ${plan.price})?\n\nYou will be prompted to complete payment via M-Pesa.`

    if (window.confirm(confirmMessage)) {
      onSelectPlan?.(plan)
      alert(
        'M-Pesa Payment Flow:\n\n1. Enter your M-Pesa phone number\n2. Receive STK push notification\n3. Enter your M-Pesa PIN\n4. Confirm payment\n\nYou will be redirected after verification...'
      )
    }
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-primary">Choose Your Plan</h2>
      </div>

      <div className="bg-gradient-to-br from-secondary/10 to-primary/5 border-2 border-dark-lighter rounded-2xl p-8">
        {/* Payment Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-secondary/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Subscribe Now</h3>
            <p className="text-text-gray text-sm">Select a plan and pay securely via M-Pesa</p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => handleSelectPlan(plan)}
              className={`p-6 rounded-xl border-2 transition-all text-center cursor-pointer transform hover:-translate-y-1 ${
                selectedPlan === plan.id
                  ? 'border-primary bg-primary/10'
                  : 'border-dark-lighter bg-dark-card hover:border-primary'
              }`}
            >
              <h4 className="text-lg font-bold text-white mb-2">{plan.name}</h4>
              <p className="text-primary text-2xl font-bold">
                KSh {plan.price}
              </p>
              <p className="text-text-gray text-sm mt-2">{plan.durationLabel} access</p>
            </button>
          ))}
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-dark-lighter text-text-gray text-sm">
          <Lock className="w-4 h-4" />
          <span>Secure M-Pesa payments powered by Safaricom</span>
        </div>
      </div>
    </div>
  )
}

