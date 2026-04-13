import Link from 'next/link'
import Image from 'next/image'
import { ROUTES } from '@/shared/constants'

const footerSections = [
  {
    title: 'Features',
    links: [
      { label: 'Past Papers', href: ROUTES.PAPERS },
      { label: 'Smart Search', href: '/#features' },
      { label: 'AI Study Bot', href: ROUTES.CHATBOT },
      { label: 'Pricing Plans', href: ROUTES.PRICING },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Browse Schools', href: ROUTES.SCHOOLS },
      { label: 'Marking Schemes', href: ROUTES.MARKING_SCHEMES },
      { label: 'YouTube Channel', href: ROUTES.YOUTUBE },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Contact', href: '#contact' },
      // { label: 'Privacy Policy', href: '#' },
      // { label: 'Terms of Service', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-dark-card border-t border-dark-lighter">
      <div className="container-custom py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <Link href={ROUTES.HOME} className="flex items-center gap-2 mb-4 group">
              <Image 
                src="/okoa-logo.png"
                alt="Okoa Sem Logo"
                width={40}
                height={40}
                className="group-hover:scale-105 transition-transform"
              />
              <span className="text-lg font-bold text-primary">Okoa Sem</span>
            </Link>
            <p className="text-text-gray leading-relaxed">
              Your comprehensive platform for accessing past papers and acing your exams.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-primary font-bold mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-text-gray hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-lighter text-center text-text-gray space-y-3">
          <p>&copy; {new Date().getFullYear()} Okoa Sem. All rights reserved.</p>
          <p className="text-sm">Payments powered by <span className="text-primary font-semibold">PayHero</span></p>
        </div>
      </div>
    </footer>
  )
}