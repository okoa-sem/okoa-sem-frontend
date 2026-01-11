import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatCurrency(amount: number): string {
  return `KSh ${amount.toLocaleString()}`
}


export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}


export function isSubscriptionActive(expiryDate: Date | string): boolean {
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate
  return expiry > new Date()
}

export function getDaysRemaining(expiryDate: Date | string): number {
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate
  const now = new Date()
  const diff = expiry.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}