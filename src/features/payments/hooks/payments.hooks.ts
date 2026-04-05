import { useQuery } from '@tanstack/react-query';
import PaymentService from '../services/paymentsService';

export const paymentQueryKeys = {
    all: ['payments'] as const,
    websocketStatus: () => [...paymentQueryKeys.all, 'websocket-status'] as const,
    subscriptionHistory: () => [...paymentQueryKeys.all, 'subscription-history'] as const,
    chatAccess: () => [...paymentQueryKeys.all, 'chat-access'] as const,
};

interface QueryOptions {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number;
}

export const useWebSocketStatus = (options?: QueryOptions) => {
    return useQuery({
        queryKey: paymentQueryKeys.websocketStatus(),
        queryFn: () => PaymentService.checkWebSocketStatus(),
        staleTime: options?.staleTime ?? 1000 * 30,
        refetchInterval: options?.refetchInterval ?? 1000 * 60,
        enabled: options?.enabled,
    });
};

export const useSubscriptionHistory = (options?: QueryOptions) => {
    return useQuery({
        queryKey: paymentQueryKeys.subscriptionHistory(),
        queryFn: () => PaymentService.getSubscriptionHistory(),
        staleTime: options?.staleTime ?? 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        enabled: options?.enabled,
    });
};

export const useActiveSubscription = (options?: QueryOptions) => {
    const { data: history = [], ...rest } = useSubscriptionHistory(options);
    const activeSubscription = history.find(sub => sub.isActive || sub.status === 'ACTIVE');
    
    return {
        ...rest,
        activeSubscription,
        isActive: !!activeSubscription,
    };
};

export const useChatAccess = (options?: QueryOptions) => {
    return useQuery({
        queryKey: paymentQueryKeys.chatAccess(),
        queryFn: () => PaymentService.checkChatAccess(),
        staleTime: options?.staleTime ?? 1000 * 60 * 5,
        refetchInterval: options?.refetchInterval,
        gcTime: 1000 * 60 * 10,
        enabled: options?.enabled,
    });
};

export const usePaymentQueries = (options?: QueryOptions) => {
    return {
        websocketStatus: useWebSocketStatus(options),
        subscriptionHistory: useSubscriptionHistory(options),
        chatAccess: useChatAccess(options),
    };
};

export default usePaymentQueries;