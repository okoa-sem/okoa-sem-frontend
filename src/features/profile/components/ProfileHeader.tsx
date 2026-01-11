'use client'

import { CheckCircle, Calendar, Clock } from 'lucide-react'
import { UserProfile } from '@/types'

interface ProfileHeaderProps {
  user: UserProfile
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const formattedMemberDate = new Date(user.memberSince).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="bg-dark-card border border-dark-lighter rounded-2xl p-6 h-fit sticky top-8">
      {/* Profile Image */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-4xl font-bold text-dark">
            {user.name.charAt(0).toUpperCase()}
          </div>
          {user.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-dark-card border-2 border-primary rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
        <p className="text-text-gray text-sm mb-3">{user.email}</p>

        {user.isVerified && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" />
            Verified Account
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-dark-lighter my-5"></div>

      {/* Stats */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-dark-lighter flex items-center justify-center">
            <Calendar className="w-4 h-4 text-text-gray" />
          </div>
          <div>
            <p className="text-xs text-text-gray">Member since</p>
            <p className="text-sm font-medium text-white">{formattedMemberDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-dark-lighter flex items-center justify-center">
            <Clock className="w-4 h-4 text-text-gray" />
          </div>
          <div>
            <p className="text-xs text-text-gray">Last active</p>
            <p className="text-sm font-medium text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {user.lastActiveTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

