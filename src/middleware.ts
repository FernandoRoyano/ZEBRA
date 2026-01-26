import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que no requieren autenticación
const publicPaths = ['/login', '/api/auth']

// Rutas estáticas y de sistema que no deben ser interceptadas
const ignorePaths = ['/_next', '/favicon.ico', '/logos']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignorar rutas estáticas y de sistema
  if (ignorePaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Permitir rutas públicas
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Verificar si existe cookie de sesión
  const sessionToken = request.cookies.get('zebra_session')?.value

  if (!sessionToken) {
    // No hay sesión, redirigir a login
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Validar el token (verificación básica en Edge Runtime)
  try {
    const decoded = atob(sessionToken)
    const [timestampStr, secret] = decoded.split(':')
    const timestamp = parseInt(timestampStr, 10)
    const now = Date.now()
    const sevenDays = 7 * 24 * 60 * 60 * 1000

    // Verificar que el token no ha expirado
    if (isNaN(timestamp) || now - timestamp > sevenDays) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Verificar el secreto
    const expectedSecret = process.env.AUTH_SECRET || ''
    if (secret !== expectedSecret) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  } catch {
    // Token inválido
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
