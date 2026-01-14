import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Navbar Skeleton */}
      <div className="h-16 border-b border-dark-lighter px-4 md:px-[5%] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dark-lighter shimmer" />
          <div className="h-6 w-24 bg-dark-lighter shimmer rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dark-lighter shimmer" />
          <div className="w-10 h-10 rounded-xl bg-dark-lighter shimmer" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-[5%] py-8">
        {/* Page Header Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-5 w-32 bg-dark-lighter shimmer rounded" />
          <div className="flex flex-col items-center justify-center space-y-3 py-4">
            <div className="h-10 w-64 md:w-96 bg-dark-lighter shimmer rounded-lg" />
            <div className="h-5 w-48 md:w-80 bg-dark-lighter shimmer rounded" />
          </div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="space-y-4">
          <div className="h-12 w-full bg-dark-lighter shimmer rounded-lg mb-6" />
          
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-dark-card border border-dark-lighter rounded-xl p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-12 h-12 rounded-xl bg-dark-lighter shimmer flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 bg-dark-lighter shimmer rounded" />
                    <div className="flex gap-2">
                      <div className="h-4 w-16 bg-dark-lighter shimmer rounded" />
                      <div className="h-4 w-16 bg-dark-lighter shimmer rounded" />
                      <div className="h-4 w-16 bg-dark-lighter shimmer rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
