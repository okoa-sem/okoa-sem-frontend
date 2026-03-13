'use client'

import React, { createContext, useContext, ReactNode, useCallback, useState, useRef, useEffect } from 'react';
import { WebSocketMessage, StkPushRequest, StkPushResponse } from '@/features/payments/types';
import { PaymentWebSocket, PaymentUtils } from '@/features/payments/services/web-sockets.integration';
import PaymentService from '@/features/payments/services/paymentsService';

import usePaymentQueries from '@/features/payments/hooks/payments.hooks';

interface PaymentContextType {
    // WebSocket functionality
    isWebSocketConnected: boolean;
    connectWebSocket: (token: string) => void;
    disconnectWebSocket: () => void;
    lastPaymentMessage: WebSocketMessage | null;

    // Payment operations
    initiatePayment: (data: StkPushRequest) => Promise<StkPushResponse>;

    // Helper utilities
    formatPhoneNumber: (phone: string) => string;
    isValidPhoneNumber: (phone: string) => boolean;
    getSubscriptionPlan: (amount: number) => 'DAILY' | 'WEEKLY' | 'MONTHLY';
    getResultCodeDescription: (code: number) => string;

    // Query state
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
    baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
}: PaymentProviderProps) => {
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
    const [lastPaymentMessage, setLastPaymentMessage] = useState<WebSocketMessage | null>(null);
    const webSocketRef = useRef<PaymentWebSocket | null>(null);

    // React Query hooks
    const {
        websocketStatus,
        subscriptionHistory,
        chatAccess
    } = usePaymentQueries();

    const connectWebSocket = useCallback((token: string) => {
        // Clean up existing connection
        if (webSocketRef.current) {
            webSocketRef.current.disconnect();
        }

        const ws = new PaymentWebSocket(
            baseUrl,
            token,
            (data) => {
                setLastPaymentMessage(data);

                // Handle messages based on actual WebSocketMessage types
                switch (data.type) {
                    case 'PAYMENT_INITIATED':
                        console.log('Payment initiated:', data.data);
                        break;
                    case 'PAYMENT_STATUS_UPDATE':
                        // Check for successful payment
                        const resultCode = data.data?.resultCode;
                        if (resultCode === 0) {
                            console.log('Payment successful!', data.data);
                            // Trigger refetch of subscription data
                            subscriptionHistory.refetch();
                            chatAccess.refetch();
                        } else if (resultCode !== undefined) {
                            console.log('Payment failed:',
                                PaymentUtils.getResultCodeDescription(resultCode));
                        }
                        break;
                    case 'SUBSCRIPTION_CREATED':
                        console.log('Subscription created:', data.data);
                        subscriptionHistory.refetch();
                        chatAccess.refetch();
                        break;
                    case 'CONNECTION_ESTABLISHED':
                        console.log('Connection established with server');
                        break;
                    case 'PONG':
                        // Ping response from server
                        break;
                    default:
                        console.log('Received message type:', data.type, data.data);
                }
            },
            () => {
                setIsWebSocketConnected(true);
                console.log('WebSocket connected');
            },
            () => {
                setIsWebSocketConnected(false);
                console.log('WebSocket disconnected');
            },
            (error) => {
                console.error('WebSocket error:', error);
                setIsWebSocketConnected(false);
            }
        );

        webSocketRef.current = ws;
        ws.connect();
    }, [baseUrl, subscriptionHistory, chatAccess]);

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

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnectWebSocket();
        };
    }, [disconnectWebSocket]);

    const value: PaymentContextType = {
        // WebSocket
        isWebSocketConnected,
        connectWebSocket,
        disconnectWebSocket,
        lastPaymentMessage,

        // Payment operations
        initiatePayment,

        // Helper utilities
        formatPhoneNumber: PaymentUtils.formatPhoneNumber,
        isValidPhoneNumber: PaymentUtils.isValidPhoneNumber,
        getSubscriptionPlan: PaymentUtils.getSubscriptionPlan,
        getResultCodeDescription: PaymentUtils.getResultCodeDescription,

        // Query state
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