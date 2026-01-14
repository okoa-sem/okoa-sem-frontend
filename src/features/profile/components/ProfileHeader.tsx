'use client'

import { useRef, useState } from 'react'
import { CheckCircle, Calendar, Clock, Camera, Trash2, Loader2, X, ZoomIn } from 'lucide-react'
import { UserProfile } from '@/types'
import { useProfileImage } from '../hooks/useProfileImage'

interface ProfileHeaderProps {
  user: UserProfile & { photoUrl?: string | null } 
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { 
    uploadProfileImage, 
    isUploading, 
    removeProfileImage, 
    isRemoving, 
  } = useProfileImage()

  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  const formattedMemberDate = new Date(user.memberSince || user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const profileImage = user.photoUrl || user.avatar

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadProfileImage(file)
    }
  }

  return (
    <div className="bg-dark-card border border-dark-lighter rounded-2xl p-6 h-fit sticky top-8">
      {/* Profile Image */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative mb-4 group">
          <div 
            className={`w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-4xl font-bold text-dark overflow-hidden relative ${profileImage ? 'cursor-pointer' : ''}`}
            onClick={() => profileImage && setIsImageModalOpen(true)}
          >
            {profileImage ? (
              <img src={profileImage} alt={user.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
            
            {/* Hover overlay hint */}
            {profileImage && !isUploading && !isRemoving && (
               <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                 <ZoomIn className="w-6 h-6 text-white" />
               </div>
             )}

            {/* Loading Overlay */}
            {(isUploading || isRemoving) && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
          />

          {user.isVerified && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-dark-card border-2 border-primary rounded-full flex items-center justify-center z-10 pointer-events-none">
              <CheckCircle className="w-3 h-3 text-primary" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
        <p className="text-text-gray text-sm mb-4">{user.email}</p>

        {/* Profile Actions */}
        <div className="flex items-center gap-2 mb-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isRemoving}
            className="flex items-center gap-2 px-3 py-1.5 bg-dark-lighter hover:bg-dark-card border border-dark-lighter hover:border-primary/50 rounded-lg transition-all text-xs font-medium text-text-gray hover:text-white"
          >
            <Camera className="w-3.5 h-3.5" />
            {profileImage ? 'Edit Photo' : 'Upload Photo'}
          </button>

          {profileImage && (
            <button 
              onClick={() => removeProfileImage()}
              disabled={isUploading || isRemoving}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-transparent hover:border-red-500/30 rounded-lg transition-all text-xs font-medium text-red-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          )}
        </div>

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

      {/* Image Modal */}
      {isImageModalOpen && profileImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <button 
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <img 
            src={profileImage} 
            alt={user.name} 
            className="max-w-full max-h-[90vh] object-contain rounded-lg animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          />
        </div>
      )}
    </div>
  )
}

