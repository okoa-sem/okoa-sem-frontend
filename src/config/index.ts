/**
 * Application Configuration
 * All configuration values are loaded from environment variables
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080';
