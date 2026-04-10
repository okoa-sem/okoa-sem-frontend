'use client'

import { useState } from 'react'
import { X, Copy, Mail, MessageCircle, Share2, Check } from 'lucide-react'
import {
  shareToClipboard,
  shareViaEmail,
  shareViaWhatsApp,
  shareViaTwitter,
  shareViaTelegram,
  generateShareableText,
  getNativeShareSupport,
  useNativeShare,
} from '@/features/chatbot/utils/shareUtils'

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  content: string
  isLight: boolean
}

export default function ShareDialog({ isOpen, onClose, content, isLight }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)
  const hasNativeShare = getNativeShareSupport()
  const shareableText = generateShareableText(content, 300)

  if (!isOpen) return null

  const handleCopyToClipboard = async () => {
    setSharing(true)
    const success = await shareToClipboard(shareableText)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    setSharing(false)
  }

  const handleNativeShare = async () => {
    setSharing(true)
    await useNativeShare({
      title: 'Study Response',
      text: shareableText,
    })
    setSharing(false)
  }

  const handleEmail = () => {
    shareViaEmail('Check out this study response from Okoa SEM', shareableText)
  }

  const handleWhatsApp = () => {
    const message = `📚 Study Response:\n\n${shareableText}\n\nShared from Okoa SEM Chatbot`
    shareViaWhatsApp(message)
  }

  const handleTwitter = () => {
    const message = `Check out this study response: ${shareableText}\n\n#StudyWithOkoaSEM #Education`
    shareViaTwitter(message)
  }

  const handleTelegram = () => {
    const message = `📚 Study Response:\n\n${shareableText}\n\nShared from Okoa SEM Chatbot`
    shareViaTelegram(message)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl shadow-xl z-50 p-6"
        style={{
          backgroundColor: isLight ? '#FFFFFF' : '#1A1A1A',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5" style={{ color: '#00D666' }} />
            <h2 className="text-lg font-semibold" style={{ color: isLight ? '#1F2937' : '#FFFFFF' }}>
              Share Response
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition"
            style={{
              color: isLight ? '#6B7280' : '#A0A0A0',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview */}
        <div
          className="rounded-lg p-3 mb-4 text-sm line-clamp-3"
          style={{
            backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
            color: isLight ? '#6B7280' : '#A0A0A0',
          }}
        >
          "{shareableText.substring(0, 100)}..."
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          {hasNativeShare && (
            <button
              onClick={handleNativeShare}
              disabled={sharing}
              className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
              style={{
                backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
                color: isLight ? '#1F2937' : '#FFFFFF',
              }}
            >
              <Share2 className="w-5 h-5 text-blue-500" />
              <div className="text-left">
                <div className="font-medium text-sm">System Share</div>
                <div className="text-xs" style={{ color: isLight ? '#6B7280' : '#A0A0A0' }}>
                  Share via default app
                </div>
              </div>
            </button>
          )}

          <button
            onClick={handleCopyToClipboard}
            disabled={sharing}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
            style={{
              backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
              color: isLight ? '#1F2937' : '#FFFFFF',
            }}
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5 text-green-500" />
            )}
            <div className="text-left">
              <div className="font-medium text-sm">{copied ? 'Copied!' : 'Copy to Clipboard'}</div>
              <div className="text-xs" style={{ color: isLight ? '#6B7280' : '#A0A0A0' }}>
                Share via messaging
              </div>
            </div>
          </button>

          <button
            onClick={handleEmail}
            disabled={sharing}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
            style={{
              backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
              color: isLight ? '#1F2937' : '#FFFFFF',
            }}
          >
            <Mail className="w-5 h-5 text-orange-500" />
            <div className="text-left">
              <div className="font-medium text-sm">Email</div>
              <div className="text-xs" style={{ color: isLight ? '#6B7280' : '#A0A0A0' }}>
                Send via email
              </div>
            </div>
          </button>

          <button
            onClick={handleWhatsApp}
            disabled={sharing}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
            style={{
              backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
              color: isLight ? '#1F2937' : '#FFFFFF',
            }}
          >
            <MessageCircle className="w-5 h-5 text-green-500" />
            <div className="text-left">
              <div className="font-medium text-sm">WhatsApp</div>
              <div className="text-xs" style={{ color: isLight ? '#6B7280' : '#A0A0A0' }}>
                Share with friends
              </div>
            </div>
          </button>

          <button
            onClick={handleTwitter}
            disabled={sharing}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
            style={{
              backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
              color: isLight ? '#1F2937' : '#FFFFFF',
            }}
          >
            <Share2 className="w-5 h-5 text-blue-400" />
            <div className="text-left">
              <div className="font-medium text-sm">Twitter/X</div>
              <div className="text-xs" style={{ color: isLight ? '#6B7280' : '#A0A0A0' }}>
                Post on social media
              </div>
            </div>
          </button>

          <button
            onClick={handleTelegram}
            disabled={sharing}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
            style={{
              backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
              color: isLight ? '#1F2937' : '#FFFFFF',
            }}
          >
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <div className="text-left">
              <div className="font-medium text-sm">Telegram</div>
              <div className="text-xs" style={{ color: isLight ? '#6B7280' : '#A0A0A0' }}>
                Send to chat group
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t" style={{ borderColor: isLight ? '#E5E7EB' : '#2A2A2A' }}>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg transition-all font-medium"
            style={{
              backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
              color: isLight ? '#1F2937' : '#FFFFFF',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}
