'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, X, Award, Calendar, CalendarDays, CreditCard, Info, Phone, CheckCircle2, AlertCircle } from 'lucide-react'
import { SubscriptionPlan } from '@/types'
import { SUBSCRIPTION_PLANS } from '@/shared/constants'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PaymentService from '@/features/payments/services/paymentsService';
import { StkPushRequest, WebSocketMessage } from '@/features/payments/types';
import { subscriptionKeys } from '@/query/keys';
import { PaymentWebSocket } from '@/features/payments/services/web-sockets.integration';

type ModalStep = 'plan-selection' | 'phone-input' | 'processing' | 'success' | 'error'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: (plan: SubscriptionPlan) => void
  defaultPlan?: 'daily' | 'weekly' | 'monthly'
  showCloseButton?: boolean
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  defaultPlan = 'monthly',
  showCloseButton = false,
}: SubscriptionModalProps) {
  const queryClient = useQueryClient()
  const [step, setStep] = useState<ModalStep>('plan-selection')
  const [selectedPlan, setSelectedPlan] = useState<'daily' | 'weekly' | 'monthly'>(defaultPlan)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const paymentTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const websocketRef = useRef<PaymentWebSocket | null>(null)
  const paymentReferenceRef = useRef<string | null>(null)
  const authTokenRef = useRef<string | null>(null)

  const { mutate: initiateStkPush, isPending: isProcessing } = useMutation({
    mutationFn: (data: StkPushRequest) => PaymentService.initiateStkPush(data),
    onSuccess: (data) => {
      console.log('STK Push initiated successfully:', data);
      paymentReferenceRef.current = data.reference;
      setStep('processing');
      setErrorMessage('');
      
      // Get auth token from localStorage (stored as 'authToken' by the auth provider)
      const token = typeof window !== 'undefined' 
        ? (localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '')
        : '';
      authTokenRef.current = token;
      
      // Initialize WebSocket connection if token is available
      if (token) {
        initializeWebSocket(token, data.reference);
      } else {
        console.warn('⚠️ No auth token found for WebSocket connection');
      }
      
      // Also start polling as backup (in case WebSocket fails)
      startPaymentPolling();
    },
    onError: (error: any) => {
      console.error('Payment initiation failed:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Payment initiation failed';

      // 404 means the backend rejected the request because the user already
      // has an active subscription.  Treat it as a successful subscription
      // rather than an error so the modal closes and grants access.
      if (error?.response?.status === 404) {
        console.log('✅ Backend returned 404 – user already has an active subscription, confirming success.');
        confirmPaymentSuccess();
        return;
      }

      if (errorMsg.toLowerCase().includes('already')) {
        setErrorMessage('You already have an active subscription. Please wait for it to expire before subscribing again.');
      } else {
        setErrorMessage(errorMsg);
      }

      setStep('error');
    },
  });

  // Define handleClose early so it can be used in confirmPaymentSuccess
  const handleClose = () => {
    setStep('plan-selection')
    setPhoneNumber('')
    setPhoneError('')
    onClose()
  }

  const { mutate: checkAccess } = useMutation({
    mutationFn: () => PaymentService.checkChatAccess(),
    onSuccess: (hasAccess) => {
      console.log('[checkAccess] Response:', hasAccess);
      if (hasAccess) {
        // Payment successful!
        console.log('✅ Payment confirmed! User has chat access.');
        confirmPaymentSuccess();
      } else {
        console.log('⏳ Subscription not ready yet, will retry...');
      }
    },
    onError: (error: any) => {
      console.error('❌ Failed to check chat access:', error?.response?.status, error?.message);
    },
  });

  const initializeWebSocket = (token: string, reference: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'wss://localhost:8080';
      
      websocketRef.current = new PaymentWebSocket(
        baseUrl,
        token,
        (message: WebSocketMessage) => handleWebSocketMessage(message),
        () => console.log('✅ WebSocket connected for payment notifications'),
        () => console.log('❌ WebSocket disconnected'),
        (error) => console.error('❌ WebSocket error:', error)
      );
      
      websocketRef.current.connect();
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  };

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    console.log('[WebSocket Message]', message.type, message);
    
    if (message.type === 'PAYMENT_SUCCESS' && message.reference === paymentReferenceRef.current) {
      console.log('🎉 Payment success confirmed via WebSocket!');
      confirmPaymentSuccess();
    } else if (message.type === 'PAYMENT_STATUS_UPDATE' && (message as any).success === true) {
      // Payment was successful - confirm and start checking subscription
      console.log('🎉 Payment status update received with success flag!');
      confirmPaymentSuccess();
    } else if (message.type === 'PAYMENT_FAILED' && message.reference === paymentReferenceRef.current) {
      console.log('❌ Payment failed via WebSocket');
      disconnectWebSocket();
      stopPolling();
      setErrorMessage(message.reason || 'Payment failed. Please try again.');
      setStep('error');
    }
  };

  const confirmPaymentSuccess = () => {
    // Stop polling and WebSocket
    stopPolling();
    disconnectWebSocket();
    
    // Clear any pending timeouts
    if (paymentTimeoutRef.current) {
      clearTimeout(paymentTimeoutRef.current);
    }
    
    setStep('success');
    
    // Invalidate subscription queries to force refetch
    queryClient.invalidateQueries({ queryKey: subscriptionKeys.history() });
    queryClient.invalidateQueries({ queryKey: subscriptionKeys.access() });
    
    // Also force refetch the access query immediately
    queryClient.refetchQueries({ queryKey: subscriptionKeys.access() });
    
    // Show success for 2 seconds then close
    paymentTimeoutRef.current = setTimeout(() => {
      const plan = SUBSCRIPTION_PLANS[selectedPlan];
      onPaymentSuccess(plan);
      handleClose();
    }, 2000);
  };

  const disconnectWebSocket = () => {
    if (websocketRef.current) {
      websocketRef.current.disconnect();
      websocketRef.current = null;
    }
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const startPaymentPolling = () => {
  let pollCount = 0;
  const maxPolls = 40;

  pollingIntervalRef.current = setInterval(async () => {
    pollCount++;
    
    // Force invalidate BEFORE checking so the query actually hits the network
    queryClient.invalidateQueries({ queryKey: subscriptionKeys.access() });
    queryClient.invalidateQueries({ queryKey: subscriptionKeys.history() });
    
    checkAccess();  // now triggers a fresh fetch, not cached false

    if (pollCount === 10 || pollCount === 20 || pollCount === 30) {
      try {
        const history = await PaymentService.getSubscriptionHistory();
        const hasActive = history.some((s) => s.isActive && s.status === 'ACTIVE');
        if (hasActive) {
          confirmPaymentSuccess();
          return;
        }
      } catch (e) {
        console.warn('History fallback check failed:', e);
      }
    }

    if (pollCount >= maxPolls) {
      stopPolling();
      setErrorMessage('Payment verification timed out...');
      setStep('error');
    }
  }, 3000);
};

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopPolling();
      disconnectWebSocket();
      if (paymentTimeoutRef.current) {
        clearTimeout(paymentTimeoutRef.current);
      }
    };
  }, []);

  // Reset modal when closed
  useEffect(() => {
    if (!isOpen) {
      setStep('plan-selection');
      setPhoneNumber('');
      setPhoneError('');
      setErrorMessage('');
      stopPolling();
      disconnectWebSocket();
      if (paymentTimeoutRef.current) {
        clearTimeout(paymentTimeoutRef.current);
      }
    } else {
      // Set selected plan when modal opens with a defaultPlan
      setSelectedPlan(defaultPlan);
    }
  }, [isOpen, defaultPlan]);

  if (!isOpen) return null

  const plan = SUBSCRIPTION_PLANS[selectedPlan]

  const handlePlanSelect = (planId: 'daily' | 'weekly' | 'monthly') => {
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

    const stkPushRequest: StkPushRequest = {
      phone_number: `254${phoneNumber}`,
      amount: plan.price,
      description: `Subscription to ${plan.name}`,
    };

    initiateStkPush(stkPushRequest);
  }

  const cancelPayment = () => {
    setShowCancelConfirmation(true)
  }

  const confirmCancelPayment = () => {
    // Stop polling and WebSocket if still active
    stopPolling();
    disconnectWebSocket();
    paymentReferenceRef.current = null;
    setShowCancelConfirmation(false)
    setStep('phone-input')
  }

  const dismissCancelConfirmation = () => {
    setShowCancelConfirmation(false)
  }
  
  const handleRetryPayment = () => {
    setErrorMessage('');
    setStep('phone-input');
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90"
        onClick={step === 'success' && !isProcessing ? handleClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-dark rounded-2xl max-w-[500px] w-full max-h-[90vh] overflow-y-auto animate-modalSlideIn shadow-2xl" style={{ boxShadow: '0 25px 50px -12px rgba(16, 216, 69, 0.3), 0 0 0 1px rgba(16, 216, 69, 0.1)' }}>
        {/* Step 1: Plan Selection */}
        {step === 'plan-selection' && (
          <>
            <div className="p-6 border-b border-dark-lighter relative text-center">
              <h2 className="text-xl font-bold text-white">Subscribe</h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 text-text-gray hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="p-6">
              {/* Premium Banner */}
              <div className="bg-gradient-to-r from-primary/15 to-secondary/15 border-2 border-primary/30 rounded-2xl p-6 mb-6">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 bg-primary text-dark rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1 text-lg">Unlock Premium Access</h3>
                    <p className="text-text-gray text-sm">
                      Get unlimited access to all past papers and premium study materials
                    </p>
                  </div>
                </div>

                {/* Premium Benefits */}
                <div className="space-y-2 mt-4 pt-4 border-t border-primary/30">
                  <div className="flex items-center gap-2 text-sm text-white">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Unlimited AI Chat Bot access</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>All past papers & mark schemes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Premium study guides</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Fast & priority processing</span>
                  </div>
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
                  <div className="text-primary font-bold text-lg">KSh {SUBSCRIPTION_PLANS.daily.price}</div>
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

                {/* Weekly Plan */}
                <button
                  onClick={() => handlePlanSelect('weekly')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 mb-3 transition-all ${
                    selectedPlan === 'weekly'
                      ? 'border-primary bg-primary/5'
                      : 'border-dark-lighter bg-dark-card hover:border-primary/50'
                  }`}
                >
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <CalendarDays className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white">Weekly Plan</div>
                    <div className="text-sm text-text-gray">7 days access</div>
                  </div>
                  {selectedPlan === 'weekly' && (
                    <span className="bg-primary text-dark px-2 py-0.5 rounded text-xs font-semibold">
                      Best Value
                    </span>
                  )}
                  <div className="text-primary font-bold text-lg">KSh {SUBSCRIPTION_PLANS.weekly.price}</div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === 'weekly'
                        ? 'border-primary bg-primary'
                        : 'border-dark-lighter'
                    }`}
                  >
                    {selectedPlan === 'weekly' && (
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
                  <div className="text-primary font-bold text-lg">KSh {SUBSCRIPTION_PLANS.monthly.price}</div>
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
              <h2 className="text-xl font-bold text-white">Subscribe</h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 text-text-gray hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
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

        {/* Step 3: Error */}
        {step === 'error' && (
          <>
            <div className="p-6 border-b border-dark-lighter relative text-center">
              <h2 className="text-xl font-bold text-white">Payment Error</h2>
            </div>

            <div className="p-6 text-center">
              {/* Error Icon */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-red-500 mb-2">Payment Failed</h3>
              <p className="text-text-gray mb-6">{errorMessage || 'An error occurred during payment'}</p>

              {/* Error Details */}
              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-5 mb-6">
                <p className="text-sm text-text-gray">
                  If you believe this is an error, please try again or contact support.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleRetryPayment}
                  className="w-full bg-primary text-dark py-3.5 rounded-xl font-semibold text-lg hover:bg-primary-dark transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="w-full border-2 border-dark-lighter text-white py-3.5 rounded-xl font-semibold hover:border-primary/50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step 4: Processing */}
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

              <h3 className="text-xl font-semibold text-blue-500 mb-2">Processing Payment</h3>
              <p className="text-text-gray mb-6">Please check your phone to complete the M-Pesa payment.</p>

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

              <div className="text-sm text-text-gray mb-4">
                Waiting for payment confirmation... (up to 5 minutes)
              </div>

              <button
                onClick={cancelPayment}
                disabled={isProcessing}
                className="w-full border-2 border-red-500 text-red-500 py-3.5 rounded-xl font-semibold hover:bg-red-500 hover:text-white transition-colors"
              >
                Cancel Payment
              </button>
            </div>
          </>
        )}

        {/* Step 5: Success */}
        {step === 'success' && (
          <>
            <div className="p-6 border-b border-dark-lighter text-center">
              <h2 className="text-xl font-bold text-white">Subscribe</h2>
            </div>

            <div className="p-6 text-center">
              {/* Success Icon */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-dark" />
              </div>

              <h3 className="text-2xl font-bold text-primary mb-2">Payment Successful!</h3>
              <p className="text-text-gray mb-6">Your subscription is now active</p>

              {/* Subscription Details */}
              <div className="bg-primary/10 border-2 border-primary rounded-xl p-5 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary text-dark rounded-xl flex items-center justify-center">
                    {selectedPlan === 'daily' ? (
                      <Calendar className="w-6 h-6" />
                    ) : (
                      <CalendarDays className="w-6 h-6" />
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-white">{plan.name}</div>
                    <div className="text-sm text-text-gray">{plan.duration}</div>
                  </div>
                  <div className="text-primary font-bold text-lg">KSh {plan.price}</div>
                </div>
              </div>

              {/* Features List */}
              <div className="text-left space-y-2 mb-6">
                <div className="text-sm text-text-gray font-semibold mb-3">You now have access to:</div>
                <div className="flex items-center gap-2 text-sm text-white">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Unlimited AI Chat Bot</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>All past papers & mark schemes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Premium study guides</span>
                </div>
              </div>

              <div className="text-sm text-text-gray">
                Redirecting to chat... 
              </div>
            </div>
          </>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90"
            onClick={dismissCancelConfirmation}
          />

          {/* Confirmation Modal */}
          <div className="relative bg-dark rounded-2xl max-w-[420px] w-full shadow-2xl" style={{ boxShadow: '0 25px 50px -12px rgba(16, 216, 69, 0.3), 0 0 0 1px rgba(16, 216, 69, 0.1)' }}>
            <div className="p-6 border-b border-dark-lighter text-center">
              <h3 className="text-xl font-bold text-white">Cancel Payment?</h3>
            </div>

            <div className="p-6 text-center">
              {/* Warning Icon */}
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>

              <p className="text-text-gray mb-2">Are you sure you want to cancel this payment?</p>
              <p className="text-sm text-text-gray/70 mb-6">You'll return to the phone number entry screen and can retry when ready.</p>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={confirmCancelPayment}
                  className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  Yes, Cancel Payment
                </button>
                <button
                  onClick={dismissCancelConfirmation}
                  className="w-full border-2 border-dark-lighter text-white py-3 rounded-xl font-semibold hover:border-primary/50 transition-colors"
                >
                  Keep Paying
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
