import type { Metadata } from 'next'

import { AuthProvider } from '@/app/providers/authentication-provider/AuthenticationProvider';

import { QueryProvider } from '@/app/providers/query-provider/QueryProvider';

import StoreProvider from '@/app/providers/store-provider/StoreProvider';

import './globals.css'

import { PaymentProvider } from './providers/payments-provider/PaymentsProvider';

export const metadata: Metadata = {
  title: 'Okoa Sem - Access Past Papers & Study Resources',
  description: 'Access 24,000+ past papers from 8 schools and 50+ departments. Search by topic, upload notes, and collaborate with study groups.',
  keywords: ['past papers', 'study resources', 'exam preparation', 'university papers', 'Kenya'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <StoreProvider>
          <QueryProvider>
            <AuthProvider>
              <PaymentProvider>
                {children}
              </PaymentProvider>
            </AuthProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  )
}