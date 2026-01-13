import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


const protectedRoutes = ['/chatbot', '/past-papers', '/youtube', '/profile', '/marking-schemes']
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get('authToken')?.value

  // Check if the user is trying to access a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !authToken) {
    // If the route is protected and there's no token, redirect to login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname) 
    return NextResponse.redirect(loginUrl)
  }

  // Check if the user is trying to access an authentication route
  if (authRoutes.includes(pathname) && authToken) {
    // If the user is authenticated and tries to access login/register, redirect to home
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If none of the above, proceed with the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
