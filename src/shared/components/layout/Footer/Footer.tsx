import Link from 'next/link'
import { ROUTES } from '@/shared/constants'

const footerSections = [
  {
    title: 'Features',
    links: [
      { label: 'Past Papers', href: ROUTES.PAPERS },
      { label: 'Smart Search', href: '/#features' },
      { label: 'AI Study Bot', href: ROUTES.CHATBOT },
      { label: 'Study Groups', href: ROUTES.STUDY_GROUPS },
      { label: 'Pricing Plans', href: ROUTES.PRICING },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Browse Schools', href: ROUTES.SCHOOLS },
      { label: 'Study Tips', href: '#' },
      { label: 'YouTube Channel', href: ROUTES.YOUTUBE },
      { label: 'Downloads', href: ROUTES.DOWNLOADS },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Contact', href: '#contact' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-dark font-bold text-lg">
                OS
              </div>
              <span className="text-xl font-bold text-primary">Okoa Sem</span>
            </div>
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
        <div className="pt-8 border-t border-dark-lighter text-center text-text-gray">
          <p>&copy; {new Date().getFullYear()} Okoa Sem. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}