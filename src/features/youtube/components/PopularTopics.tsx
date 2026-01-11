'use client'

import { YOUTUBE_TOPICS } from '@/shared/constants'

interface PopularTopicsProps {
  onTopicClick: (topic: string) => void
}

export default function PopularTopics({ onTopicClick }: PopularTopicsProps) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-bold text-white mb-3">Popular Topics</h2>
      <div className="flex flex-wrap gap-2">
        {YOUTUBE_TOPICS.map((topic) => (
          <button
            key={topic.query}
            onClick={() => onTopicClick(topic.query)}
            className="bg-dark-card px-4 py-2 rounded-lg border border-dark-lighter text-sm font-medium transition-all hover:border-primary hover:bg-primary/10 hover:scale-105"
          >
            {topic.label}
          </button>
        ))}
      </div>
    </div>
  )
}
