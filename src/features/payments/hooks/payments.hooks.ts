import { useQuery } from '@tanstack/react-query';

import PaymentService from '../services/paymentsService';


// Query keys
export const paymentQueryKeys = {
    all: ['payments'] as const,
    websocketStatus: () => [...paymentQueryKeys.all, 'websocket-status'] as const,
    subscriptionHistory: () => [...paymentQueryKeys.all, 'subscription-history'] as const,
    chatAccess: () => [...paymentQueryKeys.all, 'chat-access'] as const,
};

// WebSocket Status Query
export const useWebSocketStatus = () => {
    return useQuery({
        queryKey: paymentQueryKeys.websocketStatus(),
        queryFn: () => PaymentService.checkWebSocketStatus(),
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 60,
    });
};

// Subscription History Query
export const useSubscriptionHistory = () => {
    return useQuery({
        queryKey: paymentQueryKeys.subscriptionHistory(),
        queryFn: () => PaymentService.getSubscriptionHistory(),
        staleTime: 1000 * 60,
    });
};

// Chat Access Query
export const useChatAccess = () => {
    return useQuery({
        queryKey: paymentQueryKeys.chatAccess(),
        queryFn: () => PaymentService.checkChatAccess(),
        staleTime: 1000 * 30,
    });
};

// Combined hooks export
export const usePaymentQueries = () => {
    return {
        websocketStatus: useWebSocketStatus(),
        subscriptionHistory: useSubscriptionHistory(),
        chatAccess: useChatAccess(),
    };
};

export default usePaymentQueries;