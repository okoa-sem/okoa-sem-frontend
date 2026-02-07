import { httpClient } from "@/core/http/client";
import { ApiResponse, StkPushResponse, StkPushRequest, WebSocketStatusResponse, SubscriptionHistoryItem } from "../types";
// Types based on the documentation you provided
const PAYMENT_BASE = '/payments';

const SUBSCRIPTION_BASE = '/subscriptions';

const PaymentService = {
    /**
     * 1. Initiate STK Push Payment
     * Initiates an M-Pesa STK Push to the user's phone
     */
    async initiateStkPush(data: StkPushRequest): Promise<StkPushResponse> {
        const response = await httpClient.post<ApiResponse<StkPushResponse>>(
            `${PAYMENT_BASE}/stk-push`,
            data
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to initiate payment');
        }

        return response.data.data!;
    },

    /**
     * 2. Check WebSocket Connection Status
     * Verify if the user is connected to payment notifications WebSocket
     */
    async checkWebSocketStatus(): Promise<WebSocketStatusResponse> {

        const response = await httpClient.get<ApiResponse<WebSocketStatusResponse>>(
            `${PAYMENT_BASE}/websocket/status`
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to check WebSocket status');
        }

        return response.data.data!;

    },

    /**
     * 4. Get Subscription History
     * Retrieve user's subscription history
     */
    async getSubscriptionHistory(): Promise<SubscriptionHistoryItem[]> {

        const response = await httpClient.get<ApiResponse<SubscriptionHistoryItem[]>>(
            `${SUBSCRIPTION_BASE}/history`
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to get subscription history');
        }

        return response.data.data || [];
    },

    /**
     * 5. Check Chat Access
     * Verify if user can access chat feature (requires active subscription)
     */
    async checkChatAccess(): Promise<boolean> {

        const response = await httpClient.get<ApiResponse<boolean>>(
            `${SUBSCRIPTION_BASE}/check-access`
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to check chat access');
        }

        return response.data.data || false;
    }
};



export default PaymentService;