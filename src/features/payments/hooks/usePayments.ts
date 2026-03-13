
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { WEBSOCKET_URL } from '@/config';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const usePayments = (onPaymentSuccess: () => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const socket: Socket = io(WEBSOCKET_URL, {
      transports: ['websocket'],
      auth: {
        userId: user.id,
      },
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('payment-success', (data) => {
      console.log('Payment success message received:', data);
      onPaymentSuccess();
    });

    socket.on('payment-error', (data) => {
      console.error('Payment error message received:', data);
      // Optionally, you can handle payment errors here
    });

    return () => {
      socket.disconnect();
    };
  }, [user, onPaymentSuccess]);

  return { isConnected };
};
