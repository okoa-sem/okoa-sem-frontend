import { ReactNode } from 'react'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Okoa Sem',
    description: 'Access past papers and study resources for Meru University',
    url: 'https://okoa-sem.com',
    applicationCategory: 'EducationalApplication',
    offers: {
      '@type': 'Offer',
      price: '10-250',
      priceCurrency: 'KES',
    },
    author: {
      '@type': 'Organization',
      name: 'Okoa Sem',
      url: 'https://okoa-sem.com',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  )
}
