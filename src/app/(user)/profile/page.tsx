'use client'

import { useEffect, useState } from 'react'
import { UserProfile, UserSubscription, SubscriptionPlan } from '@/types'
import { PRICING } from '@/shared/constants'
import CompactHeader from '@/shared/components/CompactHeader'
import ProfileHeader from '@/features/profile/components/ProfileHeader'
import AccountDetails from '@/features/profile/components/AccountDetails'
import SubscriptionCard from '@/features/profile/components/SubscriptionCard'
import PaymentPlans from '@/features/profile/components/PaymentPlans'
import PaymentHistoryModal from '@/features/profile/components/PaymentHistoryModal'
import SubscriptionModal from '@/features/chatbot/components/SubscriptionModal'
import { useAuth } from '@/app/providers/authentication-provider/AuthenticationProvider'
import { usePayments } from '@/app/providers/payments-provider/PaymentsProvider'

const mockSubscription: UserSubscription = {
  isActive: false,
}

const subscriptionPlans: SubscriptionPlan[] = [
  { id: 'daily', name: PRICING.DAILY.name, duration: String(PRICING.DAILY.duration), durationLabel: '1 Day', price: PRICING.DAILY.amount },
  { id: 'weekly', name: PRICING.WEEKLY.name, duration: String(PRICING.WEEKLY.duration), durationLabel: '7 Days', price: PRICING.WEEKLY.amount },
  { id: 'monthly', name: PRICING.MONTHLY.name, duration: String(PRICING.MONTHLY.duration), durationLabel: '30 Days', price: PRICING.MONTHLY.amount },
]

export default function MyAccountPage() {
  const { user: authUser } = useAuth()
  const { hasChatAccess, subscriptionHistory, isFetchingHistory } = usePayments()
  
  const [user, setUser] = useState<UserProfile | null>(null)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [showPaymentHistory, setShowPaymentHistory] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<SubscriptionPlan | null>(null)

  const activeSubscription = subscriptionHistory.find(sub => sub.isActive || sub.status === 'ACTIVE')

  useEffect(() => {
    if (authUser) {
      setUser({
        id: String(authUser.id), 
        email: authUser.email,
        name: authUser.displayName,
        avatar: authUser.photoUrl || undefined,
        photoUrl: authUser.photoUrl || undefined,
        subscriptionStatus: hasChatAccess ? 'active' : 'free',
        createdAt: new Date(),
        lastActive: new Date(),
        isVerified: authUser.emailVerified,
        memberSince: new Date(),
        lastActiveTime: 'Just now',
        school: authUser.institution,
      } as UserProfile)
      
      if (hasChatAccess && activeSubscription) {
        const planId = (activeSubscription.subscriptionType === 'DAILY' ? 'daily' : activeSubscription.subscriptionType === 'WEEKLY' ? 'weekly' : 'monthly') as 'daily' | 'weekly' | 'monthly'
        const durationLabel = activeSubscription.subscriptionType === 'DAILY' ? '1 Day' : activeSubscription.subscriptionType === 'WEEKLY' ? '7 Days' : '30 Days'
        
        setSubscription({
          isActive: true,
          plan: {
            id: planId,
            name: activeSubscription.subscriptionType,
            price: activeSubscription.amount,
            duration: planId === 'daily' ? '1' : planId === 'weekly' ? '7' : '30',
            durationLabel,
          },
          expiresAt: new Date(activeSubscription.endDate),
        })
      } else {
        setSubscription(mockSubscription)
      }
    }
  }, [authUser, hasChatAccess, activeSubscription])

  if (!user || (!subscription && isFetchingHistory)) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <CompactHeader />
      <main className="container-custom py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="order-2 lg:order-1">
            <ProfileHeader user={user} />
          </aside>
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Account</h1>
              <p className="text-text-gray">Manage your account settings and subscription</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <AccountDetails user={user} />
              <SubscriptionCard
                subscription={subscription || mockSubscription}
                onViewHistory={() => setShowPaymentHistory(true)}
              />
            </div>
            <PaymentPlans 
              plans={subscriptionPlans} 
              onSelectPlan={(plan) => {
                setSelectedPlanForModal(plan)
                setShowSubscriptionModal(true)
              }} 
            />
          </div>
        </div>
      </main>
      <PaymentHistoryModal
        isOpen={showPaymentHistory}
        onClose={() => setShowPaymentHistory(false)}
        history={subscriptionHistory}
        isLoading={isFetchingHistory}
      />
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onPaymentSuccess={(plan) => {
          setShowSubscriptionModal(false)
        }}
        defaultPlan={selectedPlanForModal?.id as 'daily' | 'weekly' | 'monthly' || 'monthly'}
      />
    </div>
  )
}