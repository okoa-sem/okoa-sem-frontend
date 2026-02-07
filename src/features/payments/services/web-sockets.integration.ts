// WebSocket integration (not an API call, but included as per documentation)

import { WebSocketMessage } from "../types";

export class PaymentWebSocket {
    private ws: WebSocket | null = null;
    private pingInterval: NodeJS.Timeout | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    constructor(
        private baseUrl: string,
        private token: string,
        private onMessage: (data: WebSocketMessage) => void,
        private onConnect?: () => void,
        private onDisconnect?: () => void,
        private onError?: (error: Event) => void
    ) { }

    connect(): void {
        const wsUrl = this.baseUrl.replace('http', 'ws') + `/ws/payments?token=${this.token}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('WebSocket connected to payment notifications');
            this.reconnectAttempts = 0;
            this.startPingInterval();
            if (this.onConnect) this.onConnect();
        };

        this.ws.onmessage = (event) => {
            try {
                const data: WebSocketMessage = JSON.parse(event.data);
                this.onMessage(data);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (this.onError) this.onError(error);
        };

        this.ws.onclose = (event) => {
            console.log('WebSocket disconnected:', event.code, event.reason);
            this.stopPingInterval();
            if (this.onDisconnect) this.onDisconnect();

            // Attempt reconnection
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
                setTimeout(() => this.connect(), delay);
            }
        };
    }

    private startPingInterval(): void {
        this.pingInterval = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send('ping');
            }
        }, 30000); // Every 30 seconds as per documentation
    }

    private stopPingInterval(): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    disconnect(): void {
        this.reconnectAttempts = this.maxReconnectAttempts; // Stop reconnection attempts
        this.stopPingInterval();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }
}

// Helper functions based on documentation
export const PaymentUtils = {
    /**
     * Format phone number to 254XXXXXXXXX format as per documentation
     * Accepted formats: 0712345678, 254712345678, +254712345678, 712345678
     */
    formatPhoneNumber(phone: string): string {
        // Remove all non-digit characters
        let cleaned = phone.replace(/\D/g, '');

        // If starts with 0, convert to 254
        if (cleaned.startsWith('0')) {
            cleaned = '254' + cleaned.substring(1);
        }
        // If starts with 254, keep as is
        else if (cleaned.startsWith('254')) {
            // Already in correct format
        }
        // If starts with country code but missing 254 prefix
        else if (cleaned.length === 9 && cleaned.startsWith('7')) {
            cleaned = '254' + cleaned;
        }
        // If it's 12 digits with country code
        else if (cleaned.length === 12) {
            // Already valid
        }

        return cleaned;
    },

    /**
     * Validate phone number format as per documentation
     * Pattern: ^(\+254|254|0)?[17]\d{8}$
     */
    isValidPhoneNumber(phone: string): boolean {
        const pattern = /^(\+254|254|0)?[17]\d{8}$/;
        return pattern.test(phone);
    },

    /**
     * Determine subscription plan based on amount as per documentation
     */
    getSubscriptionPlan(amount: number): 'DAILY' | 'WEEKLY' | 'MONTHLY' {
        switch (amount) {
            case 1:
            case 10:
                return 'DAILY';
            case 80:
                return 'WEEKLY';
            case 250:
                return 'MONTHLY';
            default:
                // For any other amount, use amount-based logic
                if (amount <= 10) return 'DAILY';
                if (amount <= 80) return 'WEEKLY';
                return 'MONTHLY';
        }
    },

    /**
     * Parse M-Pesa result code description as per documentation
     */
    getResultCodeDescription(code: number): string {
        const descriptions: Record<number, string> = {
            0: 'Transaction successful',
            1: 'Insufficient funds',
            1032: 'Transaction cancelled by user',
            1037: 'Timeout waiting for user response',
            2001: 'Wrong PIN entered',
            1025: 'Invalid amount'
        };

        return descriptions[code] || `Unknown error (Code: ${code})`;
    }
};