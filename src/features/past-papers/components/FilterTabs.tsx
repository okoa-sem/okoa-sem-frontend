'use client'

interface FilterTabsProps {
  activeFilter: 'all' | 'main' | 'supplementary' | 'cat'
  onFilterChange: (filter: 'all' | 'main' | 'supplementary' | 'cat') => void
  activeSemester: 'all' | 'first' | 'second'
  onSemesterChange: (semester: 'all' | 'first' | 'second') => void
}

export default function FilterTabs({ 
  activeFilter, 
  onFilterChange, 
  activeSemester, 
  onSemesterChange 
}: FilterTabsProps) {
  const examFilters = [
    { id: 'all', label: 'All Exams' },
    { id: 'main', label: 'Main' },
    { id: 'supplementary', label: 'Supplementary' },
    { id: 'cat', label: 'CATs' },
  ] as const

  const semesterFilters = [
    { id: 'all', label: 'Both Semesters' },
    { id: 'first', label: 'Semester 1' },
    { id: 'second', label: 'Semester 2' },
  ] as const

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Exam Type Filter */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-text-gray text-sm self-center mr-2">Exam Type:</span>
        {examFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? 'bg-primary text-dark'
                : 'bg-dark-card border border-dark-lighter text-white hover:border-primary'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Semester Filter */}
      <div className="flex gap-2 flex-wrap sm:ml-auto">
        <span className="text-text-gray text-sm self-center mr-2">Semester:</span>
        {semesterFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onSemesterChange(filter.id)}
            className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSemester === filter.id
                ? 'bg-primary text-dark'
                : 'bg-dark-card border border-dark-lighter text-white hover:border-primary'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}
