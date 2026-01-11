'use client'

interface LoadingStateProps {
  query: string
}

export default function LoadingState({ query }: LoadingStateProps) {
  return (
    <div className="text-center py-8">
      <div className="w-[50px] h-[50px] border-4 border-dark-lighter border-t-primary rounded-full animate-spin mx-auto mb-4" />
      <p className="text-text-gray">Searching for "{query}"...</p>
    </div>
  )
}
