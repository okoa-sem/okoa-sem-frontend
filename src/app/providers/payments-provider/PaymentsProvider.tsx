'use client'

import React, { createContext, useContext, ReactNode, useCallback, useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { WebSocketMessage, StkPushRequest, StkPushResponse } from '@/features/payments/types';
import { PaymentWebSocket, PaymentUtils } from '@/features/payments/services/web-sockets.integration';
import PaymentService from '@/features/payments/services/paymentsService';
import usePaymentQueries, { paymentQueryKeys } from '@/features/payments/hooks/payments.hooks';
import { useAuth } from '@/app/providers/authentication-provider/AuthenticationProvider';

interface PaymentContextType {
    isWebSocketConnected: boolean;
    connectWebSocket: (token: string) => void;
    disconnectWebSocket: () => void;
    lastPaymentMessage: WebSocketMessage | null;
    initiatePayment: (data: StkPushRequest) => Promise<StkPushResponse>;
    formatPhoneNumber: (phone: string) => string;
    isValidPhoneNumber: (phone: string) => boolean;
    getSubscriptionPlan: (amount: number) => 'DAILY' | 'WEEKLY' | 'MONTHLY';
    getResultCodeDescription: (code: number) => string;
    isCheckingWebSocketStatus: boolean;
    isFetchingHistory: boolean;
    isCheckingChatAccess: boolean;
    subscriptionHistory: any[];
    hasChatAccess: boolean;
    refetchAll: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

interface PaymentProviderProps {
    children: ReactNode;
    baseUrl?: string;
}

export const PaymentProvider = ({
    children,
    baseUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080'
}: PaymentProviderProps) => {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    
    // Also check for authToken in localStorage to ensure token is actually available
    // This prevents queries from running before Google OAuth token is cached
    const [hasAuthToken, setHasAuthToken] = useState(false);
    
    useEffect(() => {
      const checkToken = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        setHasAuthToken(!!token);
      };
      
      checkToken();
      
      // Listen for storage changes (for token updates from other tabs/windows)
      window.addEventListener('storage', checkToken);
      return () => window.removeEventListener('storage', checkToken);
    }, []);
    
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
    const [lastPaymentMessage, setLastPaymentMessage] = useState<WebSocketMessage | null>(null);
    const webSocketRef = useRef<PaymentWebSocket | null>(null);

    // Only enable queries when both authenticated AND have a token
    const {
        websocketStatus,
        subscriptionHistory,
        chatAccess
    } = usePaymentQueries({ enabled: isAuthenticated && hasAuthToken });

    const connectWebSocket = useCallback((token: string) => {
        if (webSocketRef.current) {
            if (webSocketRef.current.isConnected()) return; 
            webSocketRef.current.disconnect();
        }

        const ws = new PaymentWebSocket(
            baseUrl,
            token,
            (data) => {
                setLastPaymentMessage(data);

                switch (data.type) {
                    case 'PAYMENT_STATUS_UPDATE':
                        if (data.data?.resultCode === 0) {
                            queryClient.invalidateQueries({ queryKey: paymentQueryKeys.all });
                        }
                        break;
                    case 'SUBSCRIPTION_CREATED':
                        queryClient.invalidateQueries({ queryKey: paymentQueryKeys.all });
                        break;
                }
            },
            () => setIsWebSocketConnected(true),
            () => setIsWebSocketConnected(false),
            () => setIsWebSocketConnected(false)
        );

        webSocketRef.current = ws;
        ws.connect();
    }, [baseUrl, queryClient]);

    const disconnectWebSocket = useCallback(() => {
        if (webSocketRef.current) {
            webSocketRef.current.disconnect();
            webSocketRef.current = null;
            setIsWebSocketConnected(false);
        }
    }, []);

    const initiatePayment = useCallback(async (data: StkPushRequest): Promise<StkPushResponse> => {
        return PaymentService.initiateStkPush(data);
    }, []);

    useEffect(() => {
        return () => {
            disconnectWebSocket();
        };
    }, [disconnectWebSocket]);

    const value: PaymentContextType = {
        isWebSocketConnected,
        connectWebSocket,
        disconnectWebSocket,
        lastPaymentMessage,
        initiatePayment,
        formatPhoneNumber: PaymentUtils.formatPhoneNumber,
        isValidPhoneNumber: PaymentUtils.isValidPhoneNumber,
        getSubscriptionPlan: PaymentUtils.getSubscriptionPlan,
        getResultCodeDescription: PaymentUtils.getResultCodeDescription,
        isCheckingWebSocketStatus: websocketStatus.isLoading,
        isFetchingHistory: subscriptionHistory.isLoading,
        isCheckingChatAccess: chatAccess.isLoading,
        subscriptionHistory: subscriptionHistory.data || [],
        hasChatAccess: chatAccess.data || false,
        refetchAll: () => {
            websocketStatus.refetch();
            subscriptionHistory.refetch();
            chatAccess.refetch();
        }
    };

    return (
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayments = () => {
    const context = useContext(PaymentContext);
    if (context === undefined) {
        throw new Error('usePayments must be used within a PaymentProvider');
    }
    return context;
};