'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { SCHOOLS, ROUTES } from '@/shared/constants'
import { useSchoolCodes, useSchoolNames } from '@/features/past-papers/hooks/useSchools'

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

const colors = Object.keys(colorClasses) as (keyof typeof colorClasses)[]

export default function SchoolsSection() {
  const [isLight, setIsLight] = useState(false)
  const { data: schoolCodes, isLoading: isLoadingCodes } = useSchoolCodes()
  const { data: schoolNames, isLoading: isLoadingNames } = useSchoolNames()

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

  const schools = useMemo(() => {
    if (!schoolCodes || !schoolNames) return [];

    return schoolCodes.map((code, index) => {
      const existing = SCHOOLS.find(s => s.id === code);
      const color = existing?.color || colors[index % colors.length];
      
      return {
        id: code,
        name: schoolNames[index] || code,
        abbreviation: existing?.abbreviation || code.slice(0, 3).toUpperCase(),
        color,
        description: existing?.description || `Explore past papers for ${schoolNames[index] || code}`,
      };
    });
  }, [schoolCodes, schoolNames]);

  // Show loading skeleton only if data hasn't loaded yet and we're still loading
  const isLoading = isLoadingCodes || isLoadingNames;
  const hasData = schoolCodes && schoolNames && schoolCodes.length > 0 && schoolNames.length > 0;

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
        {!hasData && isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="bg-dark border border-dark-lighter rounded-2xl p-6 h-[200px] animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-dark-lighter" />
                  <div className="h-4 w-12 bg-dark-lighter rounded" />
                </div>
                <div className="h-6 w-3/4 bg-dark-lighter rounded mb-2" />
                <div className="h-4 w-full bg-dark-lighter rounded mb-4" />
                <div className="h-10 w-full bg-dark-lighter rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {schools.map((school, index) => (
              <Link
                key={school.id}
                href={`${ROUTES.PAST_PAPERS}?school=${school.id}`}
                className="block"
              >
                <div
                  className="bg-dark border border-dark-lighter rounded-2xl p-6 transition-all hover:-translate-y-2 hover:border-primary cursor-pointer h-full"
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
                  <div
                    className="w-full flex items-center justify-between px-4 py-3 bg-transparent border border-dark-lighter rounded-lg text-sm font-medium transition-all hover:bg-primary hover:text-dark hover:border-primary pointer-events-none"
                  >
                    <span>Browse Papers</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                      PDF
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}