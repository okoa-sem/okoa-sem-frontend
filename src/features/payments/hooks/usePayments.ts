import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { WEBSOCKET_URL } from '@/config';
import { useAuth } from '@/app/providers/authentication-provider/AuthenticationProvider';
import { PaymentWebSocket } from '../services/web-sockets.integration';
import { paymentQueryKeys } from './payments.hooks';

export const usePayments = (onPaymentSuccess: () => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  useEffect(() => {
    if (!user || !authToken) return;

    const ws = new PaymentWebSocket(
      WEBSOCKET_URL,
      authToken,
      (message) => {
        if (message.type === 'PAYMENT_SUCCESS') {
          // Invalidate subscription queries to fetch fresh data
          queryClient.invalidateQueries({ queryKey: paymentQueryKeys.chatAccess() });
          queryClient.invalidateQueries({ queryKey: paymentQueryKeys.subscriptionHistory() });
          
          onPaymentSuccess();
        }
      },
      () => setIsConnected(true),
      () => setIsConnected(false)
    );

    ws.connect();

    return () => {
      ws.disconnect();
    };
  }, [user, authToken, onPaymentSuccess, queryClient]);

  return { isConnected };
};