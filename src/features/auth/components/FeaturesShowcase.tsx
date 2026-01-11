'use client'

import { BookOpen, FileText, Youtube, Users, Sparkles, Zap } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Chatbot',
    description: 'Get instant answers to your academic questions with our smart assistant',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: FileText,
    title: 'Past Papers',
    description: 'Access comprehensive collection of past exam papers and solutions',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Youtube,
    title: 'Smart Search',
    description: 'Find relevant educational videos curated specifically for your syllabus',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Study Groups',
    description: 'Connect and collaborate with peers in interactive study communities',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Zap,
    title: 'Quick Insights',
    description: 'Get summarized key points and insights from complex topics',
    gradient: 'from-yellow-500 to-amber-500',
  },
  {
    icon: BookOpen,
    title: 'Personalized Learning',
    description: 'Tailored study materials based on your progress and preferences',
    gradient: 'from-indigo-500 to-purple-500',
  },
]

export default function FeaturesShowcase() {
  return (
    <div className="h-full flex flex-col justify-center py-12 px-8 lg:px-16">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-dark" />
          </div>
          <h1 className="text-3xl font-bold text-white">Okoa SEM</h1>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          Your All-in-One
          <br />
          <span className="text-primary">Academic Platform</span>
        </h2>
        <p className="text-text-gray text-lg leading-relaxed max-w-md">
          Everything you need to excel in your studies, all in one powerful platform.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group bg-dark-card border border-[#2A2A2A] rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-white font-semibold text-lg mb-2">
              {feature.title}
            </h3>
            <p className="text-text-gray text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-12 flex flex-wrap gap-8">
        <div>
          <div className="text-3xl font-bold text-primary mb-1">10K+</div>
          <div className="text-text-gray text-sm">Active Students</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary mb-1">5K+</div>
          <div className="text-text-gray text-sm">Past Papers</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary mb-1">98%</div>
          <div className="text-text-gray text-sm">Success Rate</div>
        </div>
      </div>
    </div>
  )
}
