'use client'

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PastPaper, MarkingScheme } from '@/types'
import { PAST_PAPERS_SCHOOLS, generateDemoPastPapers } from '@/shared/constants'
import { useSchoolCodes, useSchoolNames, useAllYears, useYearsBySchool } from '@/features/past-papers/hooks/useSchools'
import { setSelectedSchoolId } from '@/store/slices/ui.slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
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
  const dispatch = useAppDispatch();
  const selectedSchoolId = useAppSelector((state) => state.ui.selectedSchoolId);

  const { data: schoolCodes, isLoading: isLoadingCodes } = useSchoolCodes()
  const { data: schoolNames, isLoading: isLoadingNames } = useSchoolNames()
  const { data: allYears } = useAllYears()
  

  const dynamicSchools = useMemo(() => {
    if (!schoolCodes || !schoolNames) return [];

    return schoolCodes.map((code, index) => {
     
      const existing = PAST_PAPERS_SCHOOLS.find(s => s.id === code);
      return {
        id: code,
        name: schoolNames[index] || code,
        abbreviation: existing?.abbreviation || code.split('_')[0] || 'N/A',
        years: allYears || [], // Default to all years from API, specific years loaded on selection
      };
    });
  }, [schoolCodes, schoolNames, allYears]);

  const schoolFromUrl = searchParams.get('school')
  
  const resolvedSchoolId = selectedSchoolId || schoolFromUrl || dynamicSchools[0]?.id || ''
  
  const { data: schoolYears } = useYearsBySchool(resolvedSchoolId)

  // State
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
      const school = dynamicSchools.find(s => s.id === schoolFromUrl)
      if (school) {
        dispatch(setSelectedSchoolId(school.id))
      }
    }
  }, [schoolFromUrl, dynamicSchools, dispatch])

  useEffect(() => {
    if (resolvedSchoolId && resolvedSchoolId !== selectedSchoolId) {
       dispatch(setSelectedSchoolId(resolvedSchoolId));
    }
  }, [resolvedSchoolId, selectedSchoolId, dispatch])

  // Get current school data
  const currentSchool = useMemo(() => {
    const school = dynamicSchools.find(s => s.id === resolvedSchoolId) || dynamicSchools[0]
    if (school && schoolYears) {
      return { ...school, years: schoolYears }
    }
    return school
  }, [resolvedSchoolId, dynamicSchools, schoolYears])

  
  useEffect(() => {
    if (!selectedYear || !currentSchool) {
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
  }, [resolvedSchoolId, selectedYear, currentSchool])

  
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
    dispatch(setSelectedSchoolId(schoolId));
    setSelectedYear(null)
    setSearchQuery('')
    setExamFilter('all')
    setSemesterFilter('all')
    
    router.push(`/past-papers?school=${schoolId}`, { scroll: false })
  }, [router, dispatch])

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
    // Save to localStorage 
    const existing = localStorage.getItem('marking-schemes')
    const schemes = existing ? JSON.parse(existing) : []
    schemes.push(markingScheme)
    localStorage.setItem('marking-schemes', JSON.stringify(schemes))
    
    console.log('Marking scheme generated:', markingScheme)
  }, [])

  const handleUploadToAI = useCallback((paper: PastPaper) => {
    
    router.push(`/chatbot?paper=${encodeURIComponent(paper.id)}`)
  }, [router])

  // Show loading state while fetching schools
  if (isLoadingCodes || isLoadingNames) {
    return (
      <div className="min-h-screen bg-dark flex flex-col">
        <CompactHeader />
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

            {/* Skeleton Loading UI */}
            <div className="space-y-6">
              {/* School Tabs Skeleton */}
              <div className="flex overflow-hidden gap-3 pb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 w-32 bg-dark-card border border-dark-lighter rounded-lg flex-shrink-0 animate-pulse" />
                ))}
              </div>

              {/* Info Card Skeleton */}
              <div className="h-24 bg-dark-card border border-dark-lighter rounded-xl animate-pulse" />

              {/* Year Selector Skeleton */}
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-20 bg-dark-card border border-dark-lighter rounded-full animate-pulse" />
                ))}
              </div>

              {/* Search Bar Skeleton */}
              <div className="h-12 bg-dark-card border border-dark-lighter rounded-xl animate-pulse" />

              <LoadingState />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!currentSchool) {
    return (
      <div className="min-h-screen bg-dark flex flex-col">
        <CompactHeader />
        <main className="flex-1 flex items-center justify-center text-white">
          <p>No schools found. Please try again later.</p>
        </main>
      </div>
    );
  }

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
            schools={dynamicSchools as any}
            activeSchool={resolvedSchoolId}
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
                {currentSchool.years.length > 0 && (
                  <>
                  Years: <span className="text-primary">{currentSchool.years[currentSchool.years.length - 1]}</span> - <span className="text-primary">{currentSchool.years[0]}</span>
                  </>
                )}
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
