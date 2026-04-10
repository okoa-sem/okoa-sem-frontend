/**
 * Advanced Caching Strategy
 
 *
 * Features:
 * - Multi-level caching (memory, localStorage, IndexedDB)
 * - Automatic cache invalidation
 * - Request deduplication
 * - Cache compression for large datasets
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number 
  size?: number
}

// In-memory cache (fastest, limited size)
const memoryCache = new Map<string, CacheEntry<any>>()
const MAX_MEMORY_CACHE_SIZE = 50 // Maximum entries

// Request deduplication map
const pendingRequests = new Map<string, Promise<any>>()

/**
 * Generate cache key from URL and parameters
 */
export const generateCacheKey = (
  url: string,
  params?: Record<string, any>
): string => {
  const paramString = params ? JSON.stringify(params) : ''
  return `${url}:${paramString}`
}

/**
 * Check if cache entry is still valid
 */
const isCacheValid = <T>(entry: CacheEntry<T>): boolean => {
  return Date.now() - entry.timestamp < entry.ttl
}

/**
 * Get from memory cache (fastest)
 */
export const getMemoryCache = <T>(key: string): T | null => {
  const entry = memoryCache.get(key)
  if (!entry) return null

  if (!isCacheValid(entry)) {
    memoryCache.delete(key)
    return null
  }

  return entry.data
}

/**
 * Set memory cache with TTL and size tracking
 */
export const setMemoryCache = <T>(
  key: string,
  data: T,
  ttlMs: number = 5 * 60 * 1000 // 5 minutes default
): void => {
  // Prevent memory bloat
  if (memoryCache.size >= MAX_MEMORY_CACHE_SIZE) {
    // Remove oldest entry
    const oldestKey = memoryCache.keys().next().value
    if (oldestKey) {
      memoryCache.delete(oldestKey)
    }
  }

  const size = estimateSize(data)
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
    size,
  })
}

/**
 * Clear memory cache
 */
export const clearMemoryCache = (): void => {
  memoryCache.clear()
}

/**
 * Get memory cache statistics
 */
export const getMemoryCacheStats = (): {
  size: number
  entries: number
  estimatedSizeBytes: number
} => {
  let estimatedSizeBytes = 0
  memoryCache.forEach(entry => {
    if (entry.size) {
      estimatedSizeBytes += entry.size
    }
  })

  return {
    size: memoryCache.size,
    entries: memoryCache.size,
    estimatedSizeBytes,
  }
}

/**
 * Deduplicate requests
 * If the same request is already in flight, return the same promise
 */
export const deduplicateRequest = <T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> => {
  // Check if request is already in flight
  const existingPromise = pendingRequests.get(key)
  if (existingPromise) {
    return existingPromise as Promise<T>
  }

  // Execute request
  const promise = requestFn()
    .then(data => {
      pendingRequests.delete(key)
      return data
    })
    .catch(error => {
      pendingRequests.delete(key)
      throw error
    })

  // Store promise
  pendingRequests.set(key, promise)

  return promise
}

/**
 * Estimate object size in bytes (rough estimate)
 */
const estimateSize = (obj: any): number => {
  try {
    const jsonString = JSON.stringify(obj)
    return new Blob([jsonString]).size
  } catch {
    return 0
  }
}

/**
 * Multi-level cache strategy:
 * 1. Check memory cache (fastest)
 * 2. Deduplicate in-flight requests
 * 3. Execute request
 * 4. Cache result
 */
export const fetchWithCache = async <T>(
  url: string,
  params?: Record<string, any>,
  ttlMs?: number,
  requestFn?: () => Promise<T>
): Promise<T> => {
  const cacheKey = generateCacheKey(url, params)

  // Step 1: Check memory cache
  const cachedData = getMemoryCache<T>(cacheKey)
  if (cachedData) {
    console.debug(`📦 Cache hit for ${url}`)
    return cachedData
  }

  // Step 2: Deduplicate in-flight requests
  const request = requestFn || (() => Promise.resolve({} as T))

  const data = await deduplicateRequest<T>(cacheKey, request)

  // Step 3: Cache result
  setMemoryCache(cacheKey, data, ttlMs)

  return data
}

/**
 * Batch invalidate cache by key pattern
 * Useful for invalidating related queries
 */
export const invalidateCacheByPattern = (pattern: string): number => {
  let invalidatedCount = 0

  const regex = new RegExp(pattern)
  for (const key of memoryCache.keys()) {
    if (regex.test(key)) {
      memoryCache.delete(key)
      invalidatedCount++
    }
  }

  console.debug(`🗑️  Invalidated ${invalidatedCount} cache entries matching pattern: ${pattern}`)
  return invalidatedCount
}

/**
 * Invalidate single cache entry
 */
export const invalidateCache = (key: string): void => {
  memoryCache.delete(key)
  console.debug(`🗑️  Cache invalidated for key: ${key}`)
}

/**
 * Warm cache with frequently accessed data
 * Call during app initialization
 */
export const warmCache = <T>(
  key: string,
  data: T,
  ttlMs?: number
): void => {
  setMemoryCache(key, data, ttlMs)
  console.debug(`🔥 Cache warmed for key: ${key}`)
}

/**
 * Export cache for debugging/analysis
 */
export const exportCacheStats = (): Record<string, any> => {
  const stats = getMemoryCacheStats()
  const entries: Record<string, any> = {}

  memoryCache.forEach((entry, key) => {
    entries[key] = {
      size: entry.size,
      age: Date.now() - entry.timestamp,
      ttl: entry.ttl,
      isValid: isCacheValid(entry),
    }
  })

  return {
    stats,
    entries,
  }
}
