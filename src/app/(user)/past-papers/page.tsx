'use client'

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PastPaper, MarkingScheme } from '@/types'
import { PAST_PAPERS_SCHOOLS, generateDemoPastPapers } from '@/shared/constants'
import CompactHeader from '@/shared/components/CompactHeader'
import SchoolTabs from '@/features/past-papers/components/SchoolTabs'
import YearSelector from '@/features/past-papers/components/YearSelector'
import SearchBar from '@/features/past-papers/components/SearchBar'
import PaperList from '@/features/past-papers/components/PaperList'
import PreviewModal from '@/features/past-papers/components/PreviewModal'
import GenerateMarkingSchemeModal from '@/features/past-papers/components/GenerateMarkingSchemeModal'
import EmptyState from '@/features/past-papers/components/EmptyState'
import LoadingState from '@/features/past-papers/components/LoadingState'

function PastPapersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get school from URL params, default to first school
  const schoolFromUrl = searchParams.get('school')
  const initialSchool = PAST_PAPERS_SCHOOLS.find(s => s.id === schoolFromUrl)?.id || PAST_PAPERS_SCHOOLS[0].id
  
  // State
  const [activeSchool, setActiveSchool] = useState<string>(initialSchool)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [examFilter, setExamFilter] = useState<'all' | 'main' | 'supplementary' | 'cat'>('all')
  const [semesterFilter, setSemesterFilter] = useState<'all' | 'first' | 'second'>('all')
  const [papers, setPapers] = useState<PastPaper[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [previewPaper, setPreviewPaper] = useState<PastPaper | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [markingSchemePaper, setMarkingSchemePaper] = useState<PastPaper | null>(null)
  const [isMarkingSchemeOpen, setIsMarkingSchemeOpen] = useState(false)

  
  useEffect(() => {
    if (schoolFromUrl) {
      const school = PAST_PAPERS_SCHOOLS.find(s => s.id === schoolFromUrl)
      if (school) {
        setActiveSchool(school.id)
      }
    }
  }, [schoolFromUrl])

  // Get current school data
  const currentSchool = useMemo(() => {
    return PAST_PAPERS_SCHOOLS.find(s => s.id === activeSchool) || PAST_PAPERS_SCHOOLS[0]
  }, [activeSchool])

  
  useEffect(() => {
    if (!selectedYear) {
      setPapers([])
      return
    }

    setIsLoading(true)
    
  
    const timer = setTimeout(() => {
      const demoPapers = generateDemoPastPapers(
        currentSchool.name,
        currentSchool.abbreviation,
        selectedYear
      )
      setPapers(demoPapers)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [activeSchool, selectedYear, currentSchool])

  
  const filteredPapers = useMemo(() => {
    let filtered = papers

    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(paper => 
        paper.courseCode.toLowerCase().includes(query) ||
        paper.courseName.toLowerCase().includes(query) ||
        paper.title.toLowerCase().includes(query)
      )
    }

    
    if (examFilter !== 'all') {
      filtered = filtered.filter(paper => paper.examType === examFilter)
    }

    
    if (semesterFilter !== 'all') {
      filtered = filtered.filter(paper => paper.semester === semesterFilter)
    }

    return filtered
  }, [papers, searchQuery, examFilter, semesterFilter])


  const handleSchoolChange = useCallback((schoolId: string) => {
    setActiveSchool(schoolId)
    setSelectedYear(null)
    setSearchQuery('')
    setExamFilter('all')
    setSemesterFilter('all')
    
    router.push(`/past-papers?school=${schoolId}`, { scroll: false })
  }, [router])

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year)
    setSearchQuery('')
    setExamFilter('all')
    setSemesterFilter('all')
  }, [])

  const handlePreview = useCallback((paper: PastPaper) => {
    setPreviewPaper(paper)
    setIsPreviewOpen(true)
  }, [])

  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false)
    setPreviewPaper(null)
  }, [])

  const handleGenerateMarkingScheme = useCallback((paper: PastPaper) => {
    setMarkingSchemePaper(paper)
    setIsMarkingSchemeOpen(true)
  }, [])

  const handleCloseMarkingScheme = useCallback(() => {
    setIsMarkingSchemeOpen(false)
    setMarkingSchemePaper(null)
  }, [])

  const handleGenerateMarkingSchemeSubmit = useCallback(async (paper: PastPaper, markingScheme: MarkingScheme) => {
    // Save to localStorage (in production, this would be an API call)
    const existing = localStorage.getItem('marking-schemes')
    const schemes = existing ? JSON.parse(existing) : []
    schemes.push(markingScheme)
    localStorage.setItem('marking-schemes', JSON.stringify(schemes))
    
    console.log('Marking scheme generated:', markingScheme)
  }, [])

  const handleUploadToAI = useCallback((paper: PastPaper) => {
    
    router.push(`/chatbot?paper=${encodeURIComponent(paper.id)}`)
  }, [router])

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Navigation Header */}
      <CompactHeader />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 md:px-[5%] py-8">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Browse <span className="text-primary">Past Papers</span>
            </h1>
            <p className="text-text-gray text-lg max-w-2xl mx-auto">
              Access over 25,000 past examination papers. Search, preview, download, 
              or upload to AI for instant help.
            </p>
          </div>

          {/* School Tabs */}
          <SchoolTabs
            schools={PAST_PAPERS_SCHOOLS as unknown as Array<{id: string; name: string; abbreviation: string; years: number[]}>}
            activeSchool={activeSchool}
            onSchoolChange={handleSchoolChange}
          />

          {/* School Info Card */}
          <div className="bg-dark-card border border-dark-lighter rounded-xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {currentSchool.name}
                </h2>
                <p className="text-text-gray text-sm">
                  {currentSchool.abbreviation} • {currentSchool.years.length} years of past papers available
                </p>
              </div>
              <div className="text-sm text-text-gray">
                Years: <span className="text-primary">{currentSchool.years[currentSchool.years.length - 1]}</span> - <span className="text-primary">{currentSchool.years[0]}</span>
              </div>
            </div>
          </div>

          {/* Year Selector */}
          <YearSelector
            years={[...currentSchool.years]}
            selectedYear={selectedYear}
            schoolAbbreviation={currentSchool.abbreviation}
            onYearChange={handleYearChange}
          />

          {/* Show content only when year is selected */}
          {selectedYear ? (
            <>
              {/* Search Bar */}
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                resultsCount={filteredPapers.length}
              />

              

              {/* Papers List */}
              {isLoading ? (
                <LoadingState />
              ) : (
                <PaperList
                  papers={filteredPapers}
                  onPreview={handlePreview}
                  onGenerateMarkingScheme={handleGenerateMarkingScheme}
                  onUploadToAI={handleUploadToAI}
                />
              )}
            </>
          ) : (
            <EmptyState 
              schoolName={currentSchool.name}
              hasSelectedYear={false}
            />
          )}
        </div>
      </main>

      {/* Preview Modal */}
      <PreviewModal
        paper={previewPaper}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        onGenerateMarkingScheme={handleGenerateMarkingScheme}
        onUploadToAI={handleUploadToAI}
      />

      {/* Generate Marking Scheme Modal */}
      <GenerateMarkingSchemeModal
        paper={markingSchemePaper}
        isOpen={isMarkingSchemeOpen}
        onClose={handleCloseMarkingScheme}
        onGenerate={handleGenerateMarkingSchemeSubmit}
      />
    </div>
  )
}

export default function PastPapersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark flex items-center justify-center text-white">Loading...</div>}>
      <PastPapersContent />
    </Suspense>
  )
}
