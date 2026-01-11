'use client'

import { useState } from 'react'
import { ArrowLeft, X, Award, Calendar, CalendarDays, CreditCard, Info, Phone } from 'lucide-react'
import { SubscriptionPlan } from '@/types'
import { SUBSCRIPTION_PLANS } from '@/shared/constants'

type ModalStep = 'plan-selection' | 'phone-input' | 'processing'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: (plan: SubscriptionPlan) => void
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  onPaymentSuccess,
}: SubscriptionModalProps) {
  const [step, setStep] = useState<ModalStep>('plan-selection')
  const [selectedPlan, setSelectedPlan] = useState<'daily' | 'monthly'>('monthly')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneError, setPhoneError] = useState('')

  if (!isOpen) return null

  const plan = SUBSCRIPTION_PLANS[selectedPlan]

  const handlePlanSelect = (planId: 'daily' | 'monthly') => {
    setSelectedPlan(planId)
  }

  const goToPhoneInput = () => {
    setStep('phone-input')
  }

  const goToPlanSelection = () => {
    setStep('plan-selection')
    setPhoneNumber('')
    setPhoneError('')
  }

  const validatePhone = (value: string): boolean => {
    if (value.length === 0) {
      setPhoneError('Phone number is required')
      return false
    }
    if (value.length !== 9) {
      setPhoneError('Phone number must be 9 digits')
      return false
    }
    if (!/^[0-9]+$/.test(value)) {
      setPhoneError('Phone number must contain only digits')
      return false
    }
    setPhoneError('')
    return true
  }

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const cleaned = value.replace(/\D/g, '').slice(0, 9)
    setPhoneNumber(cleaned)
    if (cleaned.length > 0) {
      validatePhone(cleaned)
    } else {
      setPhoneError('')
    }
  }

  const initiatePayment = () => {
    if (!validatePhone(phoneNumber)) return

    setStep('processing')

    // Simulate payment processing
    setTimeout(() => {
      
      onPaymentSuccess(plan)
      handleClose()
    }, 3000)
  }

  const handleClose = () => {
    setStep('plan-selection')
    setPhoneNumber('')
    setPhoneError('')
    onClose()
  }

  const cancelPayment = () => {
    if (confirm('Are you sure you want to cancel this payment?')) {
      setStep('phone-input')
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90"
        onClick={step !== 'processing' ? handleClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-dark rounded-2xl max-w-[500px] w-full max-h-[90vh] overflow-y-auto animate-modalSlideIn shadow-2xl" style={{ boxShadow: '0 25px 50px -12px rgba(16, 216, 69, 0.3), 0 0 0 1px rgba(16, 216, 69, 0.1)' }}>
        {/* Step 1: Plan Selection */}
        {step === 'plan-selection' && (
          <>
            <div className="p-6 border-b border-dark-lighter relative text-center">
              <button
                onClick={handleClose}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-white">Subscribe</h2>
            </div>

            <div className="p-6">
              {/* Premium Banner */}
              <div className="bg-gradient-to-r from-primary/15 to-secondary/15 border-2 border-primary/30 rounded-2xl p-5 flex gap-4 mb-6">
                <div className="w-12 h-12 bg-primary text-dark rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Unlock Premium Access</h3>
                  <p className="text-text-gray text-sm">
                    Get unlimited access to the AI Study Bot and premium study materials
                  </p>
                </div>
              </div>

              {/* Plan Selection */}
              <div className="mb-6">
                <div className="text-white font-semibold mb-3">Select Plan</div>

                {/* Daily Plan */}
                <button
                  onClick={() => handlePlanSelect('daily')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 mb-3 transition-all ${
                    selectedPlan === 'daily'
                      ? 'border-primary bg-primary/5'
                      : 'border-dark-lighter bg-dark-card hover:border-primary/50'
                  }`}
                >
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white">Daily Plan</div>
                    <div className="text-sm text-text-gray">24 hours access</div>
                  </div>
                  <div className="text-primary font-bold text-lg">KSh 10</div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === 'daily'
                        ? 'border-primary bg-primary'
                        : 'border-dark-lighter'
                    }`}
                  >
                    {selectedPlan === 'daily' && (
                      <div className="w-2.5 h-2.5 bg-dark rounded-full" />
                    )}
                  </div>
                </button>

                {/* Monthly Plan */}
                <button
                  onClick={() => handlePlanSelect('monthly')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedPlan === 'monthly'
                      ? 'border-primary bg-primary/5'
                      : 'border-dark-lighter bg-dark-card hover:border-primary/50'
                  }`}
                >
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <CalendarDays className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white">Monthly Plan</div>
                    <div className="text-sm text-text-gray">30 days access</div>
                  </div>
                  {selectedPlan === 'monthly' && (
                    <span className="bg-primary text-dark px-2 py-0.5 rounded text-xs font-semibold">
                      Selected
                    </span>
                  )}
                  <div className="text-primary font-bold text-lg">KSh 100</div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === 'monthly'
                        ? 'border-primary bg-primary'
                        : 'border-dark-lighter'
                    }`}
                  >
                    {selectedPlan === 'monthly' && (
                      <div className="w-2.5 h-2.5 bg-dark rounded-full" />
                    )}
                  </div>
                </button>
              </div>

              <button
                onClick={goToPhoneInput}
                className="w-full bg-primary text-dark py-3.5 rounded-xl font-semibold text-lg hover:bg-primary-dark transition-colors"
              >
                Continue
              </button>
            </div>
          </>
        )}

        {/* Step 2: Phone Input */}
        {step === 'phone-input' && (
          <>
            <div className="p-6 border-b border-dark-lighter relative text-center">
              <button
                onClick={goToPlanSelection}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-white">Subscribe</h2>
            </div>

            <div className="p-6">
              {/* Selected Plan Card */}
              <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary bg-primary/5 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  {selectedPlan === 'daily' ? (
                    <Calendar className="w-6 h-6 text-white" />
                  ) : (
                    <CalendarDays className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">{plan.name}</div>
                  <div className="text-sm text-text-gray">{plan.duration}</div>
                </div>
                <div className="text-primary font-bold text-lg">KSh {plan.price}</div>
                <span className="bg-primary text-dark px-2 py-0.5 rounded text-xs font-semibold">
                  Selected
                </span>
              </div>

              {/* Phone Input */}
              <div className="mb-6">
                <div className="text-white font-semibold mb-3">M-Pesa Phone Number</div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white font-semibold text-sm">
                    <span className="text-base">KE</span> +254
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="712345678"
                    maxLength={9}
                    className={`w-full bg-dark-card border-2 rounded-xl py-3.5 pl-24 pr-4 text-white outline-none transition-colors ${
                      phoneError ? 'border-red-500' : 'border-dark-lighter focus:border-primary'
                    }`}
                  />
                </div>
                {phoneError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <X className="w-4 h-4" />
                    {phoneError}
                  </p>
                )}
                <p className="text-blue-400 text-sm mt-2 flex items-start gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Enter the M-Pesa number to receive payment prompt</span>
                </p>
              </div>

              {/* Payment Summary */}
              <div className="bg-black/30 border border-dark-lighter rounded-xl p-5 mb-6">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-dark-lighter">
                  <CreditCard className="w-5 h-5 text-white" />
                  <span className="font-semibold text-white">Payment Summary</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-gray">Plan</span>
                    <span className="text-white">{plan.name.replace(' Plan', ' Access')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-gray">Duration</span>
                    <span className="text-white">{plan.durationLabel}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-gray">Phone Number</span>
                    <span className="text-white">
                      {phoneNumber ? `0${phoneNumber}` : 'Not entered'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-dark-lighter">
                    <span className="font-semibold text-white">Total Amount</span>
                    <span className="font-bold text-lg text-primary">KSh {plan.price}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={initiatePayment}
                disabled={!phoneNumber || phoneNumber.length !== 9}
                className="w-full bg-primary text-dark py-3.5 rounded-xl font-semibold text-lg hover:bg-primary-dark transition-colors disabled:bg-dark-lighter disabled:text-text-gray disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Pay KSh {plan.price}
              </button>
            </div>
          </>
        )}

        {/* Step 3: Processing */}
        {step === 'processing' && (
          <>
            <div className="p-6 border-b border-dark-lighter text-center">
              <h2 className="text-xl font-bold text-white">Subscribe</h2>
            </div>

            <div className="p-6 text-center">
              {/* Spinner */}
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <div className="w-full h-full border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              </div>

              <h3 className="text-xl font-semibold text-blue-500 mb-2">Initiating Payment</h3>
              <p className="text-text-gray mb-6">Setting up M-Pesa payment request...</p>

              {/* Progress Bar */}
              <div className="w-full h-1 bg-blue-500/20 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 animate-progress" />
              </div>

              {/* Payment Details */}
              <div className="bg-black/30 rounded-xl p-5 mb-6 text-left">
                <div className="flex justify-between mb-3 text-sm">
                  <span className="text-text-gray">Amount</span>
                  <span className="text-white font-semibold">KSh {plan.price}</span>
                </div>
                <div className="flex justify-between mb-3 text-sm">
                  <span className="text-text-gray">Phone</span>
                  <span className="text-white font-semibold">0{phoneNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-gray">Method</span>
                  <span className="text-white font-semibold">M-Pesa STK Push</span>
                </div>
              </div>

              <button
                onClick={cancelPayment}
                className="w-full border-2 border-red-500 text-red-500 py-3.5 rounded-xl font-semibold hover:bg-red-500 hover:text-white transition-colors"
              >
                Cancel Payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
