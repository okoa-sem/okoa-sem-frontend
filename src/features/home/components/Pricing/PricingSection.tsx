'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { PRICING } from '@/shared/constants'

const plans = [
  {
    id: 'daily',
    name: PRICING.DAILY.name,
    price: PRICING.DAILY.amount,
    duration: '24 hours access',
    features: [
      'Access all past papers',
      'Smart topic search',
      'Download PDFs',
      'Basic AI assistance',
    ],
    popular: false,
  },
  {
    id: 'monthly',
    name: PRICING.MONTHLY.name,
    price: PRICING.MONTHLY.amount,
    duration: '30 days access',
    features: [
      'Unlimited past papers access',
      'Premium AI Study Bot',
      'Notes to questions generator',
      'Study groups & collaboration',
      'Offline downloads',
      'Priority support',
    ],
    popular: true,
  },
]

export default function PricingSection() {
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

  return (
    <section 
      id="pricing" 
      className="section-padding"
      style={{
        background: isLight ? '#E0F2F1' : '#1A1A1A',
      }}
    >
      <div className="container-custom max-w-5xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-text-gray">
            Unlock premium access to all past papers and study materials
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-dark-card rounded-3xl p-8 transition-all hover:-translate-y-2 ${
                plan.popular
                  ? 'border-2 border-primary shadow-2xl shadow-primary/20'
                  : 'border border-dark-lighter'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 right-8 bg-primary text-dark px-6 py-2 rounded-full font-semibold text-sm">
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                
                {/* Price */}
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-lg text-text-gray">KSh</span>
                  <span className="text-5xl font-bold text-primary">
                    {plan.price}
                  </span>
                </div>
                <p className="text-text-gray">{plan.duration}</p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-text-gray pb-3 border-b border-dark-lighter last:border-0"
                  >
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-4 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-primary text-dark hover:bg-primary-dark'
                    : 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-dark'
                }`}
              >
                Select {plan.name}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Info */}
        <div className="text-center">
          <p className="text-text-gray">
            Secure payment via <span className="text-primary font-semibold">M-Pesa</span>
          </p>
        </div>
      </div>
    </section>
  )
}