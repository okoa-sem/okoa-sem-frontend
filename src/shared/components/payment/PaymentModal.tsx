// src/features/payments/components/PaymentModal.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Phone, CreditCard, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

import { useAuth } from '@/app/providers/authentication-provider/AuthenticationProvider'
import { usePayments } from '@/app/providers/payments-provider/PaymentsProvider'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    planName: string
    amount: number
    onSuccess?: (data: any) => void
    onError?: (error: string) => void
}

export default function PaymentModal({
    isOpen,
    onClose,
    planName,
    amount,
    onSuccess,
    onError
}: PaymentModalProps) {
    const { isAuthenticated, user } = useAuth()
    const {
        initiatePayment,
        formatPhoneNumber,
        isValidPhoneNumber
    } = usePayments()

    const [step, setStep] = useState<'phone' | 'confirm' | 'processing' | 'success' | 'error'>('phone')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isValidPhone, setIsValidPhone] = useState(true)
    const [paymentStatus, setPaymentStatus] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [isProcessing, setIsProcessing] = useState(false)

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStep('phone')
            setPhoneNumber('')
            setIsValidPhone(true)
            setPaymentStatus('')
            setErrorMessage('')
            setIsProcessing(false)

            // Pre-fill phone number if user has one
            if (user?.phoneNumber) {
                const formatted = formatPhoneNumber(user.phoneNumber)
                // Display in readable format
                if (formatted.startsWith('254')) {
                    const readable = formatted.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
                    setPhoneNumber(readable)
                }
            }
        }
    }, [isOpen, user?.phoneNumber, formatPhoneNumber])

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && step !== 'processing') onClose()
        }

        if (isOpen) {
            window.addEventListener('keydown', handleEsc)
        }

        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose, step])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isOpen])

    // Validate phone number
    const validatePhone = useCallback((phone: string) => {
        // Remove formatting for validation
        const cleaned = phone.replace(/\s/g, '')
        const isValid = isValidPhoneNumber(cleaned)
        setIsValidPhone(isValid)
        return isValid
    }, [isValidPhoneNumber])

    // Format phone number as user types
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '')

        // Format with spaces for readability
        if (value.length > 0) {
            if (value.startsWith('254')) {
                // Format: 254 712 345 678
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
            } else if (value.startsWith('07') || value.startsWith('01')) {
                // Format: 0712 345 678
                value = value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
            } else if (value.startsWith('7')) {
                // Format: 712 345 678
                value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
            }
        }

        setPhoneNumber(value)
        // Validate without spaces
        validatePhone(value.replace(/\s/g, ''))
    }

    // Handle phone submit
    const handlePhoneSubmit = () => {
        const cleanedPhone = phoneNumber.replace(/\s/g, '')

        if (!validatePhone(cleanedPhone)) {
            setErrorMessage('Please enter a valid phone number (e.g., 0712 345 678)')
            return
        }

        // Format to standard format for display
        const formatted = formatPhoneNumber(cleanedPhone)
        const displayPhone = formatted.startsWith('254')
            ? formatted.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
            : formatted

        setPhoneNumber(displayPhone)
        setStep('confirm')
    }

    // Handle payment initiation
    const handlePayment = async () => {
        if (!isAuthenticated) {
            setErrorMessage('Please login to make a payment')
            setStep('error')
            return
        }

        setStep('processing')
        setIsProcessing(true)
        setErrorMessage('')

        try {
            const cleanedPhone = phoneNumber.replace(/\s/g, '')
            const formattedPhone = formatPhoneNumber(cleanedPhone)

            const result = await initiatePayment({
                phone_number: formattedPhone,
                amount: amount,
                description: `${planName} Subscription`
            })

            setPaymentStatus('Payment initiated! Check your phone for M-Pesa prompt')
            setStep('success')
            setIsProcessing(false)

            if (onSuccess) {
                onSuccess(result)
            }

            // Auto close after success
            setTimeout(() => {
                if (step === 'success') {
                    onClose()
                }
            }, 5000)

        } catch (error: any) {
            console.error('Payment failed:', error)
            setIsProcessing(false)

            let errorMsg = 'Payment failed. Please try again.'

            // Handle specific error messages
            if (error.message?.includes('active subscription')) {
                errorMsg = 'You already have an active subscription.'
            } else if (error.message?.includes('Invalid phone') || error.message?.includes('phone')) {
                errorMsg = 'Invalid phone number format. Please use format: 0712 345 678'
            } else if (error.message?.includes('Failed to initiate') || error.message?.includes('connection')) {
                errorMsg = 'Failed to connect to payment service. Please check your connection.'
            } else if (error.message?.includes('insufficient')) {
                errorMsg = 'Insufficient balance. Please top up your M-Pesa.'
            }

            setErrorMessage(errorMsg)
            setStep('error')

            if (onError) {
                onError(errorMsg)
            }
        }
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] animate-fadeIn"
                onClick={step === 'processing' ? undefined : onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
                <div
                    className="bg-dark-card rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/30 animate-scaleIn"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-dark-lighter flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            {step === 'phone' && 'Enter Phone Number'}
                            {step === 'confirm' && 'Confirm Payment'}
                            {step === 'processing' && 'Processing Payment'}
                            {step === 'success' && 'Payment Initiated'}
                            {step === 'error' && 'Payment Failed'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-dark-lighter hover:bg-dark-lightest transition-colors"
                            disabled={step === 'processing'}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Plan Info */}
                        <div className="mb-6 p-4 bg-dark-lighter rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-text-gray">Plan</span>
                                <span className="font-semibold">{planName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-text-gray">Amount</span>
                                <span className="text-2xl font-bold text-primary">KSh {amount.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Step 1: Phone Number */}
                        {step === 'phone' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        M-Pesa Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-gray" />
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={handlePhoneChange}
                                            placeholder="0712 345 678 or 254 712 345 678"
                                            className="w-full pl-12 pr-4 py-3 bg-dark rounded-lg border border-dark-lighter focus:border-primary focus:outline-none transition-colors"
                                            autoFocus
                                            maxLength={15}
                                        />
                                    </div>
                                    {!isValidPhone && phoneNumber && (
                                        <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Please enter a valid Kenyan phone number
                                        </p>
                                    )}
                                    <p className="mt-2 text-sm text-text-gray">
                                        Enter the phone number registered with M-Pesa
                                    </p>
                                </div>

                                <button
                                    onClick={handlePhoneSubmit}
                                    disabled={!phoneNumber || !isValidPhone}
                                    className="w-full py-3 bg-primary text-dark rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        )}

                        {/* Step 2: Confirmation */}
                        {step === 'confirm' && (
                            <div className="space-y-6">
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium mb-1">Payment Instructions</p>
                                            <p className="text-sm text-text-gray">
                                                You will receive an M-Pesa STK Push on <span className="font-semibold">{phoneNumber}</span>.
                                                Enter your M-Pesa PIN when prompted to complete the payment.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-text-gray">Plan</span>
                                        <span className="font-semibold">{planName}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-text-gray">Phone Number</span>
                                        <span className="font-semibold">{phoneNumber}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-text-gray">Amount</span>
                                        <span className="text-xl font-bold text-primary">KSh {amount.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setStep('phone')
                                            // Keep the phone number but remove formatting for editing
                                            const cleaned = phoneNumber.replace(/\s/g, '')
                                            setPhoneNumber(cleaned)
                                        }}
                                        className="flex-1 py-3 border border-dark-lighter rounded-lg font-medium hover:bg-dark-lighter transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                        className="flex-1 py-3 bg-primary text-dark rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        {isProcessing ? 'Processing...' : 'Pay Now'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Processing */}
                        {step === 'processing' && (
                            <div className="text-center py-8">
                                <div className="mb-6">
                                    <div className="relative inline-block">
                                        <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                        <Loader2 className="w-12 h-12 text-primary absolute inset-0 m-auto animate-pulse" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
                                <p className="text-text-gray">
                                    Please wait while we initiate the payment...
                                </p>
                                <p className="text-sm text-text-gray mt-4">
                                    You will receive an M-Pesa prompt on your phone shortly
                                </p>
                            </div>
                        )}

                        {/* Step 4: Success */}
                        {step === 'success' && (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Payment Initiated!</h3>
                                <p className="text-text-gray mb-6">
                                    {paymentStatus || 'Check your phone for M-Pesa prompt'}
                                </p>
                                <div className="space-y-4">
                                    <div className="p-4 bg-dark-lighter rounded-xl">
                                        <p className="font-medium mb-1">Next Steps:</p>
                                        <ul className="text-sm text-text-gray space-y-1">
                                            <li>1. Check your phone for M-Pesa prompt</li>
                                            <li>2. Enter your M-Pesa PIN</li>
                                            <li>3. Wait for confirmation</li>
                                        </ul>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="w-full py-3 border border-dark-lighter rounded-lg font-medium hover:bg-dark-lighter transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Error */}
                        {step === 'error' && (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle className="w-10 h-10 text-red-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Payment Failed</h3>
                                <p className="text-text-gray mb-6">
                                    {errorMessage || 'An error occurred while processing your payment.'}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setStep('phone')
                                            setErrorMessage('')
                                        }}
                                        className="flex-1 py-3 border border-dark-lighter rounded-lg font-medium hover:bg-dark-lighter transition-colors"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-3 bg-primary text-dark rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Authentication warning */}
                        {!isAuthenticated && step === 'phone' && (
                            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-text-gray">
                                        You need to be logged in to make a payment. Please login or register first.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {step === 'phone' && (
                        <div className="p-6 border-t border-dark-lighter bg-dark-lighter/50">
                            <div className="flex items-center justify-center gap-2 text-sm text-text-gray">
                                <CreditCard className="w-4 h-4" />
                                <span>Secure payment powered by M-Pesa</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}