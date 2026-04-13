import Navigation from '@/shared/components/layout/Navigation/Navigation'
import Footer from '@/shared/components/layout/Footer/Footer'
import { PLATFORM_STATS } from '@/shared/constants'
import { Users, Target, Zap, Award } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To empower Meru University students with easy access to comprehensive study resources and intelligent AI tools that help them ace their exams and succeed academically.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in building a supportive community where students can collaborate, share knowledge, and grow together.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI technology to create intelligent study tools that adapt to individual learning styles.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We are committed to providing the highest quality study materials and support to help students excel in their exams.',
    },
  ]

  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section with Primary Color Background */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark pt-32 pb-24">
          <div className="container-custom max-w-4xl">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-2 backdrop-blur-sm">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white text-sm font-medium">About Okoa Sem</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Revolutionizing Study
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                Empowering Meru University students with intelligent study tools and comprehensive resources to excel in their exams
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="section-padding bg-dark-card">
          <div className="container-custom max-w-4xl">
            <h2 className="text-4xl font-bold mb-8 text-center text-white">Our Story</h2>
            <div className="space-y-6 text-text-gray leading-relaxed text-lg">
              <p>
                Okoa Sem was born from a simple observation: Meru University students were struggling to find organized, reliable past papers and quality study resources. We realized there was a massive gap between the resources available and what students actually needed to excel.
              </p>
              <p>
                Our team of passionate educators and tech enthusiasts came together with a mission to solve this problem. We started by digitizing thousands of past papers from various schools and departments at Meru University, organizing them intelligently, and building tools to make studying more effective.
              </p>
              <p>
                Today, Okoa Sem has become a trusted platform for Meru University students, providing not just past papers, but an integrated study ecosystem with AI-powered assistance, smart search capabilities, and a supportive community of learners.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding bg-dark">
          <div className="container-custom max-w-6xl">
            <h2 className="text-4xl font-bold mb-16 text-center text-white">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <div
                    key={value.title}
                    className="bg-dark-card rounded-2xl p-8 border border-dark-lighter hover:border-primary transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                        <p className="text-text-gray">{value.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-padding bg-dark-card">
          <div className="container-custom max-w-4xl">
            <h2 className="text-4xl font-bold mb-16 text-center text-white">By The Numbers</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {PLATFORM_STATS.TOTAL_PAPERS.toLocaleString()}+
                </div>
                <p className="text-text-gray text-lg">Past Papers Available</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {PLATFORM_STATS.TOTAL_SCHOOLS}
                </div>
                <p className="text-text-gray text-lg">Schools Covered</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {PLATFORM_STATS.TOTAL_DEPARTMENTS}+
                </div>
                <p className="text-text-gray text-lg">Departments & Courses</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {PLATFORM_STATS.TOTAL_STUDENTS.toLocaleString()}+
                </div>
                <p className="text-text-gray text-lg">Students Using Okoa Sem</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-dark">
          <div className="container-custom max-w-2xl text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Excel?
            </h2>
            <p className="text-text-gray text-lg mb-8">
              Join thousands of students who are already using Okoa Sem to ace their exams. Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-dark rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
              >
                Get Started Free
              </a>
              <a
                href="/#pricing"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-dark transition-colors"
              >
                View Pricing
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
