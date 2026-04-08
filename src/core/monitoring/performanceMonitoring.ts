/**
 * Performance Monitoring Utilities
 
 */

import { getFirebasePerformance } from '@/config/firebase'

interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
  metadata?: Record<string, any>
}

// Local metrics buffer (to be sent periodically to backend)
let metricsBuffer: PerformanceMetric[] = []
const MAX_BUFFER_SIZE = 100

/**
 * Measure operation duration
 */
export const measureOperation = async <T>(
  operationName: string,
  operation: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> => {
  const startTime = performance.now()

  try {
    const result = await operation()
    const duration = performance.now() - startTime

    recordMetric(operationName, duration, metadata)

    // Log slow operations (> 3 seconds)
    if (duration > 3000) {
      console.warn(`⚠️  Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`, metadata)
    }

    return result
  } catch (error) {
    const duration = performance.now() - startTime
    recordMetric(`${operationName}_error`, duration, { ...metadata, error: String(error) })
    throw error
  }
}

/**
 * Record performance metric
 */
export const recordMetric = (
  name: string,
  duration: number,
  metadata?: Record<string, any>
) => {
  const metric: PerformanceMetric = {
    name,
    duration,
    timestamp: Date.now(),
    metadata,
  }

  metricsBuffer.push(metric)

  // Send to Firebase Performance Monitoring if available
  try {
    const performance = getFirebasePerformance()
    if (performance) {
      
    }
  } catch (error) {
    console.warn('Failed to record metric to Firebase:', error)
  }

  // Flush buffer if it gets too large
  if (metricsBuffer.length >= MAX_BUFFER_SIZE) {
    flushMetrics()
  }
}


export const flushMetrics = async () => {
  if (metricsBuffer.length === 0) {
    return
  }

  const metricsToSend = [...metricsBuffer]
  metricsBuffer = []

  try {
   
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/metrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metrics: metricsToSend,
        timestamp: Date.now(),
      }),
    }).catch(error => {
      console.warn('Failed to send metrics to backend:', error)
      // Re-add metrics to buffer if send failed
      metricsBuffer = [...metricsToSend, ...metricsBuffer]
    })
  } catch (error) {
    console.error('Error flushing metrics:', error)
  }
}


export const getMemoryUsage = (): {
  jsHeapSizeLimit: number
  totalJSHeapSize: number
  usedJSHeapSize: number
} | undefined => {
  if ('memory' in performance) {
    return (performance as any).memory
  }
  return undefined
}

/**
 * Log memory usage
 */
export const logMemoryUsage = (label?: string) => {
  const memory = getMemoryUsage()
  if (memory) {
    const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(2)
    const limitMB = (memory.jsHeapSizeLimit / 1048576).toFixed(2)
    const percentage = ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2)

    console.log(
      `💾 Memory Usage${label ? ` (${label})` : ''}: ${usedMB}MB / ${limitMB}MB (${percentage}%)`
    )
  }
}

/**
 * Get all metrics from buffer
 */
export const getMetricsBuffer = (): PerformanceMetric[] => {
  return [...metricsBuffer]
}

/**
 * Clear metrics buffer
 */
export const clearMetricsBuffer = () => {
  metricsBuffer = []
}


export const initializePeriodicMetricsFlushing = (intervalMs: number = 60000) => {
  // Flush metrics every 1 minute
  setInterval(() => {
    flushMetrics().catch(error => {
      console.error('Error during periodic metrics flush:', error)
    })
  }, intervalMs)

  // Flush metrics when page unloads
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      flushMetrics()
    })
  }
}
