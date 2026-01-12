import { logout } from "@/features/auth/services/authService";

export const getErrorMessage = (error: any): string => {
    if (error && error.response && error.response.data && error.response.data.message) {
        return error.response.data.message;
    }
    if (error && error.message) {
        return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
};

export const handleAuthError = (error: any): string => {
    const message = getErrorMessage(error);

    if (message.toLowerCase().includes('already exist')) {
        return 'An account with this email already exists. Please login.';
    }

    if (message.toLowerCase().includes('invalid credentials')) {
        return 'Invalid email or password. Please try again.';
    }

    if (message.toLowerCase().includes('invalid otp')) {
        return 'Invalid or expired verification code. Please try again.';
    }


    return message;
};

export const handleTokenRefreshError = async (error: any) => {
    console.error("Token refresh failed:", error);
    // No need to await, let it run in the background
    logout();
    return Promise.reject(error);
};
