'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/shared/constants'

export default function AccountHeader() {
  return (
    <header className="bg-dark border-b border-dark-lighter sticky top-0 z-40">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-dark font-bold text-lg transition-transform group-hover:scale-110">
              OS
            </div>
            <span className="text-xl font-bold text-primary">Okoa Sem</span>
          </Link>

          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 px-4 py-2 border-2 border-primary rounded-lg text-primary font-semibold hover:bg-primary hover:text-dark transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
