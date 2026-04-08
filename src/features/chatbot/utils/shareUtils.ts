'use client'

export interface ShareOptions {
  title: string
  text: string
  url?: string
}

export const generateShareableText = (content: string, maxLength: number = 500): string => {
  // Truncate if too long
  if (content.length > maxLength) {
    return content.substring(0, maxLength) + '...'
  }
  return content
}

export const shareToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    return false
  }
}

export const shareViaEmail = (subject: string, body: string): void => {
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.location.href = mailtoLink
}

export const shareViaWhatsApp = (message: string): void => {
  const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
  window.open(whatsappLink, '_blank', 'width=600,height=400')
}

export const shareViaTwitter = (text: string, url?: string): void => {
  const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}${url ? `&url=${encodeURIComponent(url)}` : ''}`
  window.open(twitterLink, '_blank', 'width=600,height=400')
}

export const shareViaFacebook = (url?: string): void => {
  if (!url) {
    console.warn('Facebook share requires a URL')
    return
  }
  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  window.open(facebookLink, '_blank', 'width=600,height=400')
}

export const shareViaLinkedIn = (url?: string, title?: string): void => {
  if (!url) {
    console.warn('LinkedIn share requires a URL')
    return
  }
  const linkedInLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  window.open(linkedInLink, '_blank', 'width=600,height=400')
}

export const shareViaTelegram = (message: string): void => {
  const telegramLink = `https://t.me/share/url?url=&text=${encodeURIComponent(message)}`
  window.open(telegramLink, '_blank', 'width=600,height=400')
}

export const copyShareableLink = async (text: string): Promise<boolean> => {
  const shareText = `📚 Study Response:\n\n${text}\n\nShared from Okoa SEM Chatbot`
  return shareToClipboard(shareText)
}

export const getNativeShareSupport = (): boolean => {
  return typeof navigator !== 'undefined' && !!navigator.share
}

export const useNativeShare = async (shareData: ShareOptions): Promise<boolean> => {
  if (!getNativeShareSupport()) {
    return false
  }

  try {
    await navigator.share(shareData)
    return true
  } catch (err) {
    if ((err as any).name !== 'AbortError') {
      console.error('Share failed:', err)
    }
    return false
  }
}
