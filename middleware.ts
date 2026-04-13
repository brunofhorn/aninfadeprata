import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from '@/server/admin/session-token'

function isAdminAuthRoute(pathname: string) {
  return pathname.startsWith('/api/admin/auth')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/')
  const isAdminApi = pathname.startsWith('/api/admin/')

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next()
  }

  if (pathname === '/admin/login' || isAdminAuthRoute(pathname)) {
    if (pathname === '/admin/login') {
      const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value

      if (token) {
        try {
          await verifyAdminSessionToken(token)
          return NextResponse.redirect(new URL('/admin', request.url))
        } catch {
          return NextResponse.next()
        }
      }
    }

    return NextResponse.next()
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value

  if (!token) {
    if (isAdminApi) {
      return NextResponse.json({ message: 'Nao autenticado.' }, { status: 401 })
    }

    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    await verifyAdminSessionToken(token)
    return NextResponse.next()
  } catch {
    if (isAdminApi) {
      return NextResponse.json({ message: 'Sessao invalida.' }, { status: 401 })
    }

    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
