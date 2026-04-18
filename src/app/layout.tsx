import type { Metadata } from 'next'

import { Inter } from 'next/font/google'

import { AuthProvider } from '@/app/providers/authentication-provider/AuthenticationProvider';
import { QueryProvider } from '@/app/providers/query-provider/QueryProvider';
import StoreProvider from '@/app/providers/store-provider/StoreProvider';
import { FirebaseProvider } from '@/app/providers/firebase-provider/FirebaseProvider';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Okoa Sem - Access Past Papers & Study Resources | Meru University',
  description: 'Access 24,000+ past papers from 8 schools at Meru University. Search by topic, get AI study assistance, and prepare for exams with Okoa Sem.',
  keywords: ['past papers', 'study resources', 'exam preparation', 'Meru University papers', 'Kenya', 'AI study bot', 'marking schemes'],
  metadataBase: new URL('https://okoasem.app'),
  alternates: {
    canonical: 'https://okoasem.app',
  },
  openGraph: {
    title: 'Okoa Sem - Access Past Papers & Study Resources',
    description: 'Your comprehensive platform for accessing past papers and acing your exams at Meru University.',
    url: 'https://okoasem.app',
    siteName: 'Okoa Sem',
    images: [
      {
        url: '/okoa-logo.png',
        width: 500,
        height: 500,
        alt: 'Okoa Sem Logo',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Okoa Sem - Access Past Papers & Study Resources',
    description: 'Access 24,000+ past papers and study resources for Meru University.',
    images: ['/okoa-logo.png'],
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow',
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