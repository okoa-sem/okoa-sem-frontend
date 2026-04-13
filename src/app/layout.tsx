import type { Metadata } from 'next'

import { Inter } from 'next/font/google'

import { AuthProvider } from '@/app/providers/authentication-provider/AuthenticationProvider';
import { QueryProvider } from '@/app/providers/query-provider/QueryProvider';
import StoreProvider from '@/app/providers/store-provider/StoreProvider';
import { FirebaseProvider } from '@/app/providers/firebase-provider/FirebaseProvider';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Okoa Sem - Access Past Papers & Study Resources',
  description: 'Access 24,000+ past papers from 8 schools and 50+ departments. Search by topic, upload notes, and collaborate with study groups.',
  keywords: ['past papers', 'study resources', 'exam preparation', 'university papers', 'Kenya'],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
    other: {
      rel: 'icon',
      url: '/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <FirebaseProvider>
          <StoreProvider>
            <QueryProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </QueryProvider>
          </StoreProvider>
        </FirebaseProvider>
      </body>
    </html>
  )
}