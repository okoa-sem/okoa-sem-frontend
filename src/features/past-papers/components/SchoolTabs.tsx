'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SchoolTab {
  id: string
  name: string
  abbreviation: string
  years: number[]
}

interface SchoolTabsProps {
  schools: SchoolTab[]
  activeSchool: string
  onSchoolChange: (schoolId: string) => void
}

export default function SchoolTabs({ schools, activeSchool, onSchoolChange }: SchoolTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    window.addEventListener('resize', checkScrollButtons)
    return () => window.removeEventListener('resize', checkScrollButtons)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
      setTimeout(checkScrollButtons, 300)
    }
  }

  return (
    <div className="relative mb-6">
      {/* Left scroll button */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-dark-card border border-dark-lighter rounded-full flex items-center justify-center text-white hover:border-primary hover:text-primary transition-colors shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Schools container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="schools-scroll flex gap-3 overflow-x-auto px-2 py-2 scroll-smooth"
      >
        {schools.map((school) => (
          <button
            key={school.id}
            onClick={() => onSchoolChange(school.id)}
            className={`flex-shrink-0 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeSchool === school.id
                ? 'bg-primary text-dark'
                : 'bg-dark-card border-2 border-dark-lighter text-white hover:border-primary hover:text-primary'
            }`}
          >
            {school.abbreviation}
          </button>
        ))}
      </div>

      {/* Right scroll button */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-dark-card border border-dark-lighter rounded-full flex items-center justify-center text-white hover:border-primary hover:text-primary transition-colors shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
