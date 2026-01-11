'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Mail } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    question: 'How do I make payments?',
    answer: 'We accept M-Pesa, credit/debit cards, and PayPal. Simply choose your preferred plan, select your payment method, and follow the secure checkout process. All transactions are encrypted and secure.',
  },
  {
    question: 'How many past papers are available?',
    answer: 'We have over 24,000+ past papers from 8 major Kenyan universities, covering 50+ departments. Our collection is continuously updated with new papers every semester.',
  },
  {
    question: 'What can the AI Study Bot do?',
    answer: 'Our AI Study Bot can explain complex concepts, help you solve problems step-by-step, generate practice questions, summarize notes, and provide personalized study recommendations based on your learning patterns.',
  },
  {
    question: 'Can I download papers for offline use?',
    answer: 'Yes! Premium subscribers can download unlimited papers in PDF format for offline studying. Free users can download up to 5 papers per month.',
  },
  {
    question: 'Which schools and departments are covered?',
    answer: 'We cover all major Kenyan universities including UoN, KU, JKUAT, Moi, Egerton, Maseno, MMUST, and TUK. Departments include Engineering, Business, Medicine, Law, Education, IT, and many more.',
  },
  {
    question: 'How does the Notes to Questions feature work?',
    answer: 'Upload your lecture notes or study materials, and our AI will automatically generate relevant exam-style questions. This helps you test your understanding and prepare for actual exams.',
  },
  {
    question: 'Can I study with friends?',
    answer: 'Absolutely! Create or join study groups, share papers and notes, discuss questions in real-time, and track group progress together. Collaborative learning made easy.',
  },
  {
    question: 'What happens when my subscription expires?',
    answer: 'You\'ll retain access to your downloaded papers and study history. You can continue using free features, but premium features like unlimited downloads and AI assistance will be limited until you renew.',
  },
  {
    question: 'Is Okoa Sem mobile-friendly?',
    answer: 'Yes! Okoa Sem is fully responsive and works beautifully on all devices. We also have dedicated iOS and Android apps for the best mobile experience.',
  },
  {
    question: 'Is my personal information secure?',
    answer: 'Your privacy is our priority. We use bank-level encryption, never share your data with third parties, and comply with all data protection regulations. Your study habits and personal info stay private.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      setIsLight(document.body.classList.contains('light-theme'))
    }
    
    checkTheme()
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme()
        }
      })
    })
    
    observer.observe(document.body, { attributes: true })
    
    return () => observer.disconnect()
  }, [])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section 
      id="faq" 
      className="py-24 md:py-32"
      style={{
        backgroundColor: isLight ? '#E8F9ED' : '#141414',
      }}
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: isLight ? '#111827' : '#FFFFFF' }}
          >
            Frequently Asked Questions
          </h2>
          
          <p 
            className="text-xl"
            style={{ color: isLight ? '#4B5563' : '#9CA3AF' }}
          >
            Everything you need to know about Okoa Sem
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`group rounded-2xl overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'shadow-xl' : 'shadow-md hover:shadow-lg'
                }`}
                style={{
                  backgroundColor: isLight 
                    ? openIndex === index ? '#FFFFFF' : 'rgba(255,255,255,0.8)'
                    : openIndex === index ? '#1A1A1A' : 'rgba(26,26,26,0.8)',
                  border: `1px solid ${
                    isLight 
                      ? openIndex === index ? 'rgba(0,200,83,0.3)' : 'rgba(0,0,0,0.05)'
                      : openIndex === index ? 'rgba(0,200,83,0.3)' : 'rgba(255,255,255,0.05)'
                  }`,
                }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        openIndex === index 
                          ? 'bg-primary text-white' 
                          : isLight 
                            ? 'bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary'
                            : 'bg-white/5 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'
                      }`}
                    >
                      <span className="font-bold text-sm">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <span 
                      className={`text-lg font-semibold transition-colors ${
                        openIndex === index
                          ? 'text-primary'
                          : isLight 
                            ? 'text-gray-900 group-hover:text-primary' 
                            : 'text-white group-hover:text-primary'
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <div 
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openIndex === index 
                        ? 'bg-primary text-white rotate-180' 
                        : isLight
                          ? 'bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary'
                          : 'bg-white/5 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                
                {/* Answer Panel */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div 
                    className="px-6 pb-6 pl-20"
                    style={{ color: isLight ? '#4B5563' : '#9CA3AF' }}
                  >
                    <p className="leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div 
            className="rounded-2xl p-8 md:p-12"
            style={{
              backgroundColor: isLight ? 'rgba(0,200,83,0.05)' : 'rgba(0,200,83,0.05)',
              border: `1px solid ${isLight ? 'rgba(0,200,83,0.1)' : 'rgba(0,200,83,0.1)'}`,
            }}
          >
            <div className="text-center">
              <h3 
                className="text-2xl md:text-3xl font-bold mb-3"
                style={{ color: isLight ? '#111827' : '#FFFFFF' }}
              >
                Still have questions?
              </h3>
              
              <p 
                className="text-lg mb-8 max-w-md mx-auto"
                style={{ color: isLight ? '#4B5563' : '#9CA3AF' }}
              >
                Our support team is here to help you succeed. Get in touch and we'll respond within 24 hours.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"
                >
                  <Mail className="w-5 h-5" />
                  Contact Support
                </Link>
                
                <Link
                  href="/chatbot"
                  className={`inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 ${
                    isLight 
                      ? 'bg-white text-gray-800 shadow-lg hover:shadow-xl border border-gray-200' 
                      : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
                  }`}
                >
                  Ask AI Bot
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}