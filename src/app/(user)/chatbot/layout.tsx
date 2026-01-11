'use client'

import { useEffect } from 'react'

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Add chatbot-page class to body when this layout is mounted
  useEffect(() => {
    document.body.classList.add('chatbot-page')
    
   
    return () => {
      document.body.classList.remove('chatbot-page')
    }
  }, [])

  return <>{children}</>
}
