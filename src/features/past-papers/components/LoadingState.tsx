'use client'

export default function LoadingState() {
  return (
    <div className="space-y-3">
      {/* Shimmer loading cards */}
      {[...Array(6)].map((_, index) => (
        <div 
          key={index}
          className="bg-dark-card border border-dark-lighter rounded-xl p-4"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Icon placeholder */}
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-dark-lighter shimmer flex-shrink-0" />
              
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-dark-lighter shimmer rounded w-3/4" />
                <div className="h-4 bg-dark-lighter shimmer rounded w-1/2" />
              </div>
            </div>

            {/* Button placeholders */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="h-10 w-24 bg-dark-lighter shimmer rounded-lg" />
              <div className="h-10 w-28 bg-dark-lighter shimmer rounded-lg" />
              <div className="h-10 w-20 bg-dark-lighter shimmer rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
