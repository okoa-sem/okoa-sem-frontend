'use client'

import { useState, useEffect, useMemo, useCallback, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PastPaper, MarkingScheme } from '@/types'
import { PAST_PAPERS_SCHOOLS } from '@/shared/constants'
import { useSchoolCodes, useSchoolNames, useAllYears, useYearsBySchool } from '@/features/past-papers/hooks/useSchools'
import { usePapersByYear, useLatestPapers, useSearchPapers } from '@/features/past-papers/hooks/usePapers'
import { ExamPaper } from '@/features/past-papers/types/api'
import { setSelectedSchoolId } from '@/store/slices/ui.slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useDebounce } from '@/shared/hooks/useDebounce';
import CompactHeader from '@/shared/components/CompactHeader'
import SchoolTabs from '@/features/past-papers/components/SchoolTabs'
import YearSelector from '@/features/past-papers/components/YearSelector'
import SearchBar from '@/features/past-papers/components/SearchBar'
import PaperList from '@/features/past-papers/components/PaperList'
import PreviewModal from '@/features/past-papers/components/PreviewModal'
import GenerateMarkingSchemeModal from '@/features/past-papers/components/GenerateMarkingSchemeModal'
import EmptyState from '@/features/past-papers/components/EmptyState'
import LoadingState from '@/features/past-papers/components/LoadingState'
import Pagination from '@/shared/components/Pagination'

function PastPapersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch();
  const selectedSchoolId = useAppSelector((state) => state.ui.selectedSchoolId);

  const { data: schoolCodes, isLoading: isLoadingCodes } = useSchoolCodes()
  const { data: schoolNames, isLoading: isLoadingNames } = useSchoolNames()
  const { data: allYears } = useAllYears()

  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;

  const { data: latestPapers, isLoading: isLatestLoading } = useLatestPapers({ page: currentPage, size: pageSize });
  const { data: papersByYear, refetch: refetchPapers, isLoading: isYearLoading } = usePapersByYear(selectedYear!, {
    page: currentPage,
    size: pageSize,
    sortBy: 'uploadedAt',
    sortDirection: 'DESC'
  });

  // Map API papers to UI format
  const mapApiPaperToUi = (apiPaper: ExamPaper): PastPaper => ({
    id: apiPaper.id.toString(),
    title: apiPaper.filename.replace('.pdf', '').replace(/-/g, ' '),
    courseCode: apiPaper.filename.split('-')[0] || 'UNK',
    courseName: apiPaper.filename.split('-').slice(1, -1).join(' ') || apiPaper.filename,
    school: apiPaper.schoolName,
    year: apiPaper.year,
    semester: 'unknown',
    examType: 'main', 
    fileUrl: apiPaper.s3Url,
    fileSize: apiPaper.fileSize,
    uploadedAt: new Date(apiPaper.uploadedAt),
    downloads: 0, 
    previewUrl: apiPaper.s3Url // Use s3Url for preview as well
  });

  // Dynamic school list based on API data
  const dynamicSchools = useMemo(() => {
    if (!schoolCodes || !schoolNames) return [];

    return schoolCodes.map((code, index) => {
     
      const existing = PAST_PAPERS_SCHOOLS.find(s => s.id === code);
      return {
        id: code,
        name: schoolNames[index] || code,
        abbreviation: existing?.abbreviation || code.split('_')[0] || 'N/A', 
        years: allYears || [], 
      };
    });
  }, [schoolCodes, schoolNames, allYears]);

  const schoolFromUrl = searchParams.get('school')
  
  const resolvedSchoolId = selectedSchoolId || schoolFromUrl || dynamicSchools[0]?.id || ''
  
  const { data: schoolYears } = useYearsBySchool(resolvedSchoolId)

  // State
 
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchQuery, selectedYear]);

  const { data: searchResults, isLoading: isSearchLoading } = useSearchPapers({
    filename: debouncedSearchQuery,
    schoolCode: selectedSchoolId || undefined, // Optional: restrict search to selected school
    page: currentPage,
    size: pageSize,
    sortBy: 'uploadedAt',
    sortDirection: 'DESC'
  }); 

  const [examFilter, setExamFilter] = useState<'all' | 'main' | 'supplementary' | 'cat'>('all')
  const [semesterFilter, setSemesterFilter] = useState<'all' | 'first' | 'second'>('all')
  
  const [previewPaper, setPreviewPaper] = useState<PastPaper | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [markingSchemePaper, setMarkingSchemePaper] = useState<PastPaper | null>(null)

  // Determine which dataset to display
  const activeData = debouncedSearchQuery ? searchResults : (selectedYear ? papersByYear : latestPapers);
  const isLoading = debouncedSearchQuery ? isSearchLoading : (selectedYear ? isYearLoading : isLatestLoading);
  
  const papers = useMemo(() => {
    if (!activeData?.content) return [];
    return activeData.content.map(mapApiPaperToUi);
  }, [activeData]);
  
  // Calculate pagination stats
  const paginationData = activeData;
  const totalPages = paginationData?.totalPages || 0;
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

  
  
  const filteredPapers = useMemo(() => {
    let filtered = papers

    // Client-side filters for properties not yet supported by API search
    if (examFilter !== 'all') {
      filtered = filtered.filter(paper => paper.examType === examFilter)
    }

    if (semesterFilter !== 'all') {
      filtered = filtered.filter(paper => paper.semester === semesterFilter)
    }

    return filtered
  }, [papers, examFilter, semesterFilter])


  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSchoolChange = useCallback((schoolId: string) => {
    dispatch(setSelectedSchoolId(schoolId));
    setSelectedYear(null)
    setCurrentPage(0) // Reset page on school change
    setSearchQuery('')
    setExamFilter('all')
    setSemesterFilter('all')
    
    router.push(`/past-papers?school=${schoolId}`, { scroll: false })
  }, [router, dispatch])

  const handleYearChange = useCallback((year: number | null) => {
    setSelectedYear(year)
    setCurrentPage(0) // Reset page on year change
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

          {/* Show content only when year is selected or searching */}
          {filteredPapers.length > 0 || isLoading || debouncedSearchQuery ? (
            <>
              {/* Search Bar */}
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                resultsCount={paginationData?.totalElements}
              />

              

              {/* Papers List */}
              {isLoading ? (
                <LoadingState />
              ) : (
                <>
                  <PaperList
                    papers={filteredPapers}
                    onPreview={handlePreview}
                    onGenerateMarkingScheme={handleGenerateMarkingScheme}
                    onUploadToAI={handleUploadToAI}
                  />
                  
                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                  />
                </>
              )}
            </>
          ) : (
             <EmptyState
              schoolName={currentSchool?.name}
              hasSelectedYear={!!selectedYear}
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
