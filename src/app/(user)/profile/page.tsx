'use client'

import { useEffect, useState } from 'react'
import { UserProfile, UserSubscription, SubscriptionPlan } from '@/types'
import { PRICING } from '@/shared/constants'
import CompactHeader from '@/shared/components/CompactHeader'
import ProfileHeader from '@/features/profile/components/ProfileHeader'
import AccountDetails from '@/features/profile/components/AccountDetails'
import SubscriptionCard from '@/features/profile/components/SubscriptionCard'
import PaymentPlans from '@/features/profile/components/PaymentPlans'


const mockUser: UserProfile = {
  id: '1',
  email: 'cherotichm182@gmail.com',
  name: 'Mercy Cherotich',
  avatar: undefined,
  subscriptionStatus: 'free',
  createdAt: new Date('2025-09-12'),
  lastActive: new Date(),
  isVerified: true,
  memberSince: new Date('2025-09-12'),
  lastActiveTime: '4 minutes ago',
}

const mockSubscription: UserSubscription = {
  isActive: false,
}


const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'daily',
    name: PRICING.DAILY.name,
    duration: String(PRICING.DAILY.duration),
    durationLabel: '1 Day',
    price: PRICING.DAILY.amount,
  },
  {
    id: 'monthly',
    name: PRICING.MONTHLY.name,
    duration: String(PRICING.MONTHLY.duration),
    durationLabel: '30 Days',
    price: PRICING.MONTHLY.amount,
  },
]

export default function MyAccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)

  useEffect(() => {
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setUser(mockUser)
      setSubscription(mockSubscription)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleSelectPlan = (plan: SubscriptionPlan) => {
  
    console.log('Selected plan:', plan)
  }

  const handleViewHistory = () => {
    alert('Payment history modal would open here')
  }

  if (!user || !subscription) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Navigation Header */}
      <CompactHeader />

      {/* Main Content */}
      <main className="container-custom py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Left Sidebar - Profile */}
          <aside className="order-2 lg:order-1">
            <ProfileHeader user={user} />
          </aside>

          {/* Right Content */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Account</h1>
              <p className="text-text-gray">Manage your account settings and subscription</p>
            </div>

            {/* Account Details & Subscription */}
            <div className="grid md:grid-cols-2 gap-6">
              <AccountDetails user={user} />
              <SubscriptionCard
                subscription={subscription}
                onViewHistory={handleViewHistory}
              />
            </div>

            {/* Payment Plans */}
            <PaymentPlans plans={subscriptionPlans} onSelectPlan={handleSelectPlan} />
          </div>
        </div>
      </main>
    </div>
  )
}
