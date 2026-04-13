/**
 * Screenshot and content protection styles
 * Apply these classes to elements you want to protect from screenshots
 */

export const protectedContentStyles = `
  /* Prevent text selection */
  .protected-content {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    
    /* Prevent drag and drop */
    -webkit-user-drag: none;
    
    /* Prevent touch callout on mobile */
    -webkit-touch-callout: none;
  }

  /* Prevent image dragging */
  .protected-content img {
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }

  /* Prevent iframe copying */
  .protected-content iframe {
    pointer-events: none;
  }

  /* Add watermark styling (optional) */
  .screenshot-watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 8rem;
    color: rgba(0, 0, 0, 0.05);
    pointer-events: none;
    z-index: -1;
    white-space: nowrap;
    font-weight: bold;
    letter-spacing: 20px;
  }
`

/**
 * Dynamically add protected content class and watermark
 */
export const addScreenshotProtection = (element: HTMLElement, showWatermark = true) => {
  // Add protected content class
  element.classList.add('protected-content')

  // Add watermark if requested
  if (showWatermark) {
    const watermark = document.createElement('div')
    watermark.className = 'screenshot-watermark'
    watermark.textContent = '© CONFIDENTIAL'
    element.appendChild(watermark)
  }
}

/**
 * Inject protection styles into the document
 */
export const injectProtectionStyles = () => {
  if (typeof document === 'undefined') return

  const styleElement = document.createElement('style')
  styleElement.textContent = protectedContentStyles
  styleElement.id = 'screenshot-protection-styles'

  // Only inject once
  if (!document.getElementById('screenshot-protection-styles')) {
    document.head.appendChild(styleElement)
  }
}
