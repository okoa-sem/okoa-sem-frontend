export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
}

export interface StkPushRequest {
    phone_number: string;
    amount: number;
    description?: string;
}

export interface StkPushResponse {
    success: boolean;
    status: string;
    reference: string;
    checkoutRequestId: string;
    message: string;
}

export interface WebSocketStatusResponse {
    isConnected: boolean;
    userId: number;
    totalConnectedUsers: number;
    websocketEndpoint: string;
    checkedAt: string;
}

export interface SubscriptionHistoryItem {
    id: number;
    subscriptionType: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    status: 'ACTIVE' | 'EXPIRED' | 'EXTENDED' | 'CANCELLED';
    startDate: string;
    endDate: string;
    amount: number;
    isActive: boolean;
    paymentReference: string;
    createdAt: string;
}

export interface WebSocketMessage {
    type: 'CONNECTION_ESTABLISHED' | 'PAYMENT_INITIATED' | 'PAYMENT_STATUS_UPDATE' | 'SUBSCRIPTION_CREATED' | 'PONG';
    timestamp: string;
    [key: string]: any;
}
