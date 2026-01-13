'use client'

import { AlertTriangle, X } from 'lucide-react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Marking Scheme",
  message = "Are you sure you want to delete this marking scheme? This action cannot be undone."
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-dark-card w-full max-w-md rounded-xl overflow-hidden border border-dark-lighter shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-lighter">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-gray hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-text-gray">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-dark-lighter bg-dark/50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-dark-lighter text-white rounded-lg font-medium hover:bg-dark-lighter/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
