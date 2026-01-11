'use client'

export default function YouTubeHeader() {
  return (
    <div className="mb-2">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl animate-pulse">▶️</span>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-white bg-clip-text text-transparent">
          Study with YouTube
        </h1>
      </div>
      <p className="text-text-gray text-sm md:text-base max-w-[600px]">
        Discover educational videos and tutorials to complement your studies.
      </p>
    </div>
  )
}
