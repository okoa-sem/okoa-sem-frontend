'use client'

import { User, Mail, CheckCircle } from 'lucide-react'
import { UserProfile } from '@/types'

interface AccountDetailsProps {
  user: UserProfile
}

export default function AccountDetails({ user }: AccountDetailsProps) {
  const infoRows = [
    {
      label: 'Full Name',
      value: user.name,
      icon: User,
      color: 'text-primary',
      bgColor: 'bg-primary/15',
    },
    {
      label: 'Email Address',
      value: user.email,
      icon: Mail,
      color: 'text-secondary',
      bgColor: 'bg-secondary/15',
    },
    {
      label: 'Account Status',
      value: user.isVerified ? 'Verified' : 'Not Verified',
      icon: CheckCircle,
      color: user.isVerified ? 'text-green-400' : 'text-text-gray',
      bgColor: user.isVerified ? 'bg-green-500/15' : 'bg-text-gray/15',
    },
  ]

  return (
    <div className="bg-dark-card border border-dark-lighter rounded-2xl p-6 h-fit">
      <h3 className="text-lg font-semibold text-white mb-5">Account Details</h3>

      <div className="space-y-4">
        {infoRows.map((row, idx) => {
          const Icon = row.icon
          return (
            <div
              key={idx}
              className="flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${row.bgColor}`}>
                <Icon className={`w-5 h-5 ${row.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-text-gray text-xs mb-0.5">{row.label}</div>
                <div className="text-white font-medium truncate">{row.value}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

