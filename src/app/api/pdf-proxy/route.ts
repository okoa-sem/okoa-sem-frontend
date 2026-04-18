import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/core/monitoring/logger'

// Allowed domain — only proxy URLs from your own S3 bucket
const ALLOWED_HOSTS = [
  'amazonaws.com',
  'digitaloceanspaces.com',
  'nyc3.digitaloceanspaces.com',
  'sgp1.digitaloceanspaces.com',
  'fra1.digitaloceanspaces.com',
]

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ALLOWED_HOSTS.some(host => parsed.hostname.endsWith(host))
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  if (!isAllowedUrl(url)) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 })
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        // Forward a neutral user-agent — some S3 configs block requests without one
        'User-Agent': 'Mozilla/5.0 (compatible; OkoaSem/1.0)',
      },
      // No credentials — public S3 objects only
    })

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${upstream.status}` },
        { status: upstream.status }
      )
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/pdf'
    const body = await upstream.arrayBuffer()

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Allow the browser (same origin) to read the response
        'Access-Control-Allow-Origin': '*',
        // Cache for 10 minutes so repeated opens don't re-fetch
        'Cache-Control': 'public, max-age=600',
        // Block any attempt to embed this in an external page
        'X-Frame-Options': 'SAMEORIGIN',
        // Prevent the browser from offering a "Save" dialog for the proxied bytes
        'Content-Disposition': 'inline',
      },
    })
  } catch (err) {
    logger.error('PDF proxy fetch failed', { message: (err as Error)?.message })
    return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 502 })
  }
}

// Support preflight requests
export async function HEAD(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url || !isAllowedUrl(url)) {
    return new NextResponse(null, { status: url ? 403 : 400 })
  }

  return new NextResponse(null, {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
  })
}