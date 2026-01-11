'use client'

interface EmptyStateProps {
  hasSearched?: boolean
}

export default function EmptyState({ hasSearched = false }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-8 bg-dark-card rounded-2xl border-2 border-dashed border-dark-lighter">
      <div className="w-[100px] h-[100px] mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center text-5xl">
        {hasSearched ? '🔍' : '▶️'}
      </div>
      <h3 className="text-2xl font-bold mb-3">
        {hasSearched ? 'No Videos Found' : 'Ready to Learn?'}
      </h3>
      <p className="text-text-gray max-w-[600px] mx-auto">
        {hasSearched
          ? 'Try searching with different keywords or check out our popular topics.'
          : 'Search for any educational topic above or click on a popular topic to discover amazing video tutorials and lectures.'}
      </p>
    </div>
  )
}
