'use client'

import { useState } from 'react'
import { X, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react'
import { SubscriptionHistoryItem } from '@/features/payments/types'

interface PaymentHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  history: SubscriptionHistoryItem[]
  isLoading?: boolean
}

const getStatusBadge = (status: string) => {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/15 text-green-400 text-xs font-medium rounded-full">
        <CheckCircle className="w-3 h-3" /> Active
      </span>
    case 'EXPIRED':
      return <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500/15 text-gray-400 text-xs font-medium rounded-full">
        <Clock className="w-3 h-3" /> Expired
      </span>
    case 'EXTENDED':
      return <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/15 text-blue-400 text-xs font-medium rounded-full">
        <CheckCircle className="w-3 h-3" /> Extended
      </span>
    case 'CANCELLED':
      return <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/15 text-red-400 text-xs font-medium rounded-full">
        <X className="w-3 h-3" /> Cancelled
      </span>
    default:
      return <span className="text-text-gray text-xs">{status}</span>
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export default function PaymentHistoryModal({ 
  isOpen, 
  onClose, 
  history, 
  isLoading = false 
}: PaymentHistoryModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[80vh] bg-dark-card border border-dark-lighter rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-lighter">
          <h2 className="text-xl font-bold text-white">Payment History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-lighter rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-gray" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-text-gray">
              <DollarSign className="w-12 h-12 opacity-30 mb-2" />
              <p>No payment history found</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-lighter">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-6 hover:bg-dark-lighter/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold">
                        {item.subscriptionType} Subscription
                      </h3>
                      <p className="text-text-gray text-sm mt-1">
                        Reference: {item.paymentReference}
                      </p>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-text-gray">Amount</p>
                        <p className="text-white font-medium">KSh {item.amount}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-text-gray">Created</p>
                        <p className="text-white font-medium">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-text-gray">Start Date</p>
                      <p className="text-white">
                        {formatDate(item.startDate)}
                      </p>
                      <p className="text-text-gray text-xs">
                        {formatTime(item.startDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-gray">End Date</p>
                      <p className="text-white">
                        {formatDate(item.endDate)}
                      </p>
                      <p className="text-text-gray text-xs">
                        {formatTime(item.endDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dark-lighter">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-primary rounded-xl text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
