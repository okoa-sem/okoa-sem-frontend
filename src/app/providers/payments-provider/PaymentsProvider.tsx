'use client'

import React, { createContext,  useContext, ReactNode } from 'react';

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {

    return (
        <PaymentContext.Provider value={{}}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayments = () => {
    const context = useContext(PaymentContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an PaymentProvider');
    }
    return context;
};