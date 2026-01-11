'use client'

import { useEffect } from 'react'

export default function YouTubeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  useEffect(() => {
    document.body.classList.add('youtube-page')
    
    return () => {
      document.body.classList.remove('youtube-page')
    }
  }, [])

  return <>{children}</>
}
