'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PastPapersHeader() {
  return (
    <nav className="bg-dark border-b border-[#2A2A2A] px-4 md:px-[5%] py-4 flex-shrink-0">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-primary font-bold text-xl md:text-2xl">
          <div className="w-10 h-10 md:w-11 md:h-11 bg-primary text-dark rounded-xl flex items-center justify-center font-bold text-lg">
            OS
          </div>
          <span>Okoa Sem</span>
        </Link>
        
        <Link 
          href="/"
          className="flex items-center gap-2 px-4 py-2 border-2 border-[#2A2A2A] rounded-lg text-white font-semibold hover:border-primary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>
    </nav>
  )
}
