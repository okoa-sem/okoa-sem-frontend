'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SCHOOLS, ROUTES } from '@/shared/constants'

const colorClasses = {
  blue: 'bg-blue-500/20 text-blue-400',
  green: 'bg-green-500/20 text-green-400',
  amber: 'bg-amber-500/20 text-amber-400',
  gray: 'bg-gray-500/20 text-gray-400',
  purple: 'bg-purple-500/20 text-purple-400',
  pink: 'bg-pink-500/20 text-pink-400',
  cyan: 'bg-cyan-500/20 text-cyan-400',
  teal: 'bg-teal-500/20 text-teal-400',
}

export default function SchoolsSection() {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      setIsLight(document.body.classList.contains('light-theme'))
    }
    
    checkTheme()
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme()
        }
      })
    })
    
    observer.observe(document.body, { attributes: true })
    
    return () => observer.disconnect()
  }, [])

  return (
    <section 
      id="schools" 
      className="section-padding"
      style={{
        background: isLight ? '#E8F9F0' : '#151515',
      }}
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Browse by School
          </h2>
          <p className="text-xl text-text-gray">
            Access past papers organized by school and department
          </p>
        </div>

        {/* Schools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SCHOOLS.map((school, index) => (
            <div
              key={school.id}
              className="bg-dark border border-dark-lighter rounded-2xl p-6 transition-all hover:-translate-y-2 hover:border-primary cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* School Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                    colorClasses[school.color as keyof typeof colorClasses]
                  }`}
                >
                  {school.abbreviation.slice(0, 2)}
                </div>
                <div className="text-sm font-bold text-text-gray uppercase">
                  {school.abbreviation}
                </div>
              </div>

              {/* School Info */}
              <h3 className="text-lg font-bold mb-2 line-clamp-2">
                {school.name}
              </h3>
              <p className="text-sm text-text-gray mb-4 line-clamp-2">
                {school.description}
              </p>

              {/* Browse Button */}
              <Link
                href={`${ROUTES.PAST_PAPERS}?school=${school.id}`}
                className="w-full flex items-center justify-between px-4 py-3 bg-transparent border border-dark-lighter rounded-lg text-sm font-medium transition-all hover:bg-primary hover:text-dark hover:border-primary"
              >
                <span>Browse Papers</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                  PDF
                </span>
              </Link>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href={ROUTES.PAST_PAPERS}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
          >
            View All Schools & Departments
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}