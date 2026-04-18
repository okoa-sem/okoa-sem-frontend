import { useEffect, useRef } from 'react'

export const useScreenshotProtection = (contentRef?: React.RefObject<HTMLDivElement>) => {
  const attemptCountRef = useRef(0)
  const isActiveRef = useRef(true)
  const isMobileRef = useRef(false)

  useEffect(() => {
    // Detect if device is mobile
    isMobileRef.current = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    const handleKeyDown = (e: KeyboardEvent) => {
      // Print Screen
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        attemptCountRef.current++
        console.warn(`[Screenshot Protection] Print Screen attempt blocked (${attemptCountRef.current})`)
        return false
      }

      // Ctrl+Shift+S (Save screenshot - Chrome)
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyS') {
        e.preventDefault()
        attemptCountRef.current++
        console.warn(`[Screenshot Protection] Ctrl+Shift+S attempt blocked (${attemptCountRef.current})`)
        return false
      }

      // Cmd+Shift+4 (Mac screenshot tool)
      if (e.metaKey && e.shiftKey && e.code === 'Digit4') {
        e.preventDefault()
        attemptCountRef.current++
        console.warn(`[Screenshot Protection] Cmd+Shift+4 attempt blocked (${attemptCountRef.current})`)
        return false
      }

      // Cmd+Shift+3 (Mac screenshot all)
      if (e.metaKey && e.shiftKey && e.code === 'Digit3') {
        e.preventDefault()
        attemptCountRef.current++
        console.warn(`[Screenshot Protection] Cmd+Shift+3 attempt blocked (${attemptCountRef.current})`)
        return false
      }

      // F12 (Developer tools)
      if (e.key === 'F12') {
        e.preventDefault()
        attemptCountRef.current++
        console.warn(`[Screenshot Protection] F12 attempt blocked (${attemptCountRef.current})`)
        return false
      }

      // Ctrl+Shift+I (Developer tools - Windows/Linux)
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyI') {
        e.preventDefault()
        attemptCountRef.current++
        console.warn(`[Screenshot Protection] Ctrl+Shift+I attempt blocked (${attemptCountRef.current})`)
        return false
      }

      // Cmd+Option+I (Developer tools - Mac)
      if (e.metaKey && e.altKey && e.code === 'KeyI') {
        e.preventDefault()
        attemptCountRef.current++
        console.warn(`[Screenshot Protection] Cmd+Option+I attempt blocked (${attemptCountRef.current})`)
        return false
      }

      // Cmd+Option+U (View source - Mac)
      if (e.metaKey && e.altKey && e.code === 'KeyU') {
        e.preventDefault()
        attemptCountRef.current++
        console.warn(`[Screenshot Protection] Cmd+Option+U attempt blocked (${attemptCountRef.current})`)
        return false
      }

      // Ctrl+U (View source)
      if (e.ctrlKey && e.code === 'KeyU') {
        e.preventDefault()
        attemptCountRef.current++
        console.warn(`[Screenshot Protection] Ctrl+U attempt blocked (${attemptCountRef.current})`)
        return false
      }

      // Ctrl+Shift+C (Inspect element)
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyC') {
        e.preventDefault()
        attemptCountRef.current++
        console.warn(`[Screenshot Protection] Ctrl+Shift+C attempt blocked (${attemptCountRef.current})`)
        return false
      }

      // Cmd+Option+C (Inspect element - Mac)
      if (e.metaKey && e.altKey && e.code === 'KeyC') {
        e.preventDefault()
        attemptCountRef.current++
        console.warn(`[Screenshot Protection] Cmd+Option+C attempt blocked (${attemptCountRef.current})`)
        return false
      }
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      console.warn(`[Screenshot Protection] Right-click attempt blocked`)
      return false
    }

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      console.warn(`[Screenshot Protection] Copy attempt blocked`)
      return false
    }

    const handlePrint = (e: Event) => {
      e.preventDefault()
      console.warn(`[Screenshot Protection] Print attempt blocked`)
      return false
    }

    // MOBILE-SPECIFIC PROTECTIONS
    const handleTouchStart = (e: TouchEvent) => {
      // Detect long-press (screenshot trigger on some Android devices)
      if (e.touches.length === 2 || e.touches.length >= 3) {
        // Multiple finger touch - often used for screenshots
        e.preventDefault()
        console.warn(`[Screenshot Protection] Multi-finger touch detected (${e.touches.length} fingers)`)
        return false
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      // Prevent long-press context menu
      if (e.target instanceof Element) {
        e.target.dispatchEvent(new Event('touchend', { bubbles: true, cancelable: true }))
      }
    }

    const handleLongPress = (e: PointerEvent) => {
      // Detect long-press on mobile
      if (isMobileRef.current) {
        e.preventDefault()
        console.warn(`[Screenshot Protection] Long-press attempt blocked`)
        return false
      }
    }

    const handleVisibilityChange = () => {
      // Detect app backgrounding (potential screenshot action on iOS)
      if (document.hidden) {
        console.warn(`[Screenshot Protection] App backgrounded - possible screenshot taken`)
        attemptCountRef.current++
      }
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown, { capture: true })
    document.addEventListener('contextmenu', handleContextMenu, { capture: true })
    document.addEventListener('copy', handleCopy, { capture: true })
    document.addEventListener('touchstart', handleTouchStart, { capture: true })
    document.addEventListener('touchend', handleTouchEnd, { capture: true })
    document.addEventListener('pointerdown', handleLongPress, { capture: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeprint', handlePrint)

    // Disable text selection via CSS
    const targetElement = contentRef?.current || document.body
    targetElement.style.userSelect = 'none'
    targetElement.style.webkitUserSelect = 'none'
    ;(targetElement as any).style.webkitTouchCallout = 'none' // Disable long-press menu on iOS
    ;(targetElement as any).style.msUserSelect = 'none'
    ;(targetElement as any).style.MozUserSelect = 'none'

    // Disable drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    targetElement.addEventListener('dragstart', handleDragStart)

    // Disable long-press context menu for elements
    const handlePointerDown = (e: PointerEvent) => {
      if (isMobileRef.current && e.pointerType === 'touch') {
        // Track long-press duration
        const startTime = Date.now()
        const onPointerUp = () => {
          const duration = Date.now() - startTime
          if (duration > 500) {
            // Long press detected
            console.warn(`[Screenshot Protection] Long-press detected (${duration}ms)`)
            attemptCountRef.current++
          }
          document.removeEventListener('pointerup', onPointerUp)
        }
        document.addEventListener('pointerup', onPointerUp)
      }
    }

    targetElement.addEventListener('pointerdown', handlePointerDown)

    // Disable zoom-in (which can be used to view high-res screenshots)
    const handleWheel = (e: WheelEvent) => {
      if ((e.ctrlKey || e.metaKey) && isMobileRef.current) {
        e.preventDefault()
        console.warn(`[Screenshot Protection] Pinch-to-zoom attempt blocked`)
        return false
      }
    }

    targetElement.addEventListener('wheel', handleWheel, { passive: false })

    // Mobile: Detect screen orientation changes (screenshot action on some devices)
    const handleOrientationChange = () => {
      console.warn(`[Screenshot Protection] Screen orientation changed - possible screenshot`)
      attemptCountRef.current++
    }

    window.addEventListener('orientationchange', handleOrientationChange)

    // Mobile: Monitor for volume button presses (used for screenshots on some Android devices)
    const handleMediaSessionAction = (details: any) => {
      if (details.action === 'screenshot') {
        console.warn(`[Screenshot Protection] Screenshot action detected via media session`)
        attemptCountRef.current++
      }
    }

    // Attempt to set screenshot action handler (may not be supported on all browsers)
    try {
      if (navigator.mediaSession) {
        // @ts-ignore - 'screenshot' might not be a standard action
        navigator.mediaSession.setActionHandler('screenshot', handleMediaSessionAction as any)
      }
    } catch (e) {
      // Silently fail if media session doesn't support screenshot action
      console.debug('[Screenshot Protection] Media session screenshot handler not supported')
    }

    // Periodic check on mobile for activity
    const mobileCheckInterval = setInterval(() => {
      if (isMobileRef.current) {
        // Check screen dimensions (some devices change on screenshot)
        const screenWidth = window.screen.width
        const screenHeight = window.screen.height
        // Log for potential analysis
      }
    }, 5000) // Check every 5 seconds

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true })
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true })
      document.removeEventListener('copy', handleCopy, { capture: true })
      document.removeEventListener('touchstart', handleTouchStart, { capture: true })
      document.removeEventListener('touchend', handleTouchEnd, { capture: true })
      document.removeEventListener('pointerdown', handleLongPress, { capture: true })
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeprint', handlePrint)
      window.removeEventListener('orientationchange', handleOrientationChange)
      targetElement.removeEventListener('dragstart', handleDragStart)
      targetElement.removeEventListener('pointerdown', handlePointerDown)
      targetElement.removeEventListener('wheel', handleWheel)
      clearInterval(mobileCheckInterval)
      isActiveRef.current = false
    }
  }, [contentRef])

  return {
    attemptCount: attemptCountRef.current,
    isActive: isActiveRef.current,
  }
}
