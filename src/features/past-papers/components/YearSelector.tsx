'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface YearSelectorProps {
  years: number[]
  selectedYear: number | null
  schoolAbbreviation: string
  onYearChange: (year: number) => void
}

export default function YearSelector({ years, selectedYear, schoolAbbreviation, onYearChange }: YearSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="mb-6">
      <div ref={dropdownRef} className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-6 py-4 bg-dark-card border-2 border-dark-lighter rounded-xl text-white hover:border-primary transition-colors"
        >
          <span className="font-semibold text-lg">
            {selectedYear ? (
              <>
                <span className="text-primary">{selectedYear}</span>
                <span className="mx-2">{schoolAbbreviation}</span>
                <span className="text-text-gray">Past Papers</span>
              </>
            ) : (
              <>Select Year</>
            )}
          </span>
          <ChevronDown className={`w-5 h-5 text-text-gray transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="year-dropdown absolute top-full left-0 mt-2 w-full min-w-[200px] bg-dark-card border border-dark-lighter rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    onYearChange(year)
                    setIsOpen(false)
                  }}
                  className={`w-full px-5 py-3 text-left transition-colors ${
                    selectedYear === year
                      ? 'bg-primary text-dark font-semibold'
                      : 'text-white hover:bg-dark-lighter'
                  }`}
                >
                  {year} {schoolAbbreviation} Past Papers
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedYear && (
        <p className="mt-3 text-text-gray text-sm">
          Showing all past papers from {schoolAbbreviation} for the year {selectedYear}
        </p>
      )}
    </div>
  )
}
