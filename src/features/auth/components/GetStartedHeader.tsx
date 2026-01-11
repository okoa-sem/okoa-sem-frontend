'use client'

import Link from 'next/link'
import { User } from 'lucide-react'

export default function GetStartedHeader() {
  return (
    <nav className="bg-dark border-b border-[#2A2A2A] px-4 md:px-[5%]">
      <div className="max-w-[1400px] mx-auto py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-primary font-bold text-xl hover:opacity-80 transition-opacity">
          <div className="w-11 h-11 bg-primary text-dark rounded-xl flex items-center justify-center text-2xl">
            🎓
          </div>
          <span>Okoa Sem</span>
        </Link>

        <Link
          href="/profile"
          className="w-11 h-11 bg-dark-card border-2 border-[#2A2A2A] rounded-xl flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-colors"
          title="My Account"
        >
          <User className="w-5 h-5" />
        </Link>
      </div>
    </nav>
  )
}
