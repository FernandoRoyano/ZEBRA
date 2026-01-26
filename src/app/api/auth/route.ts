import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const AUTH_PASSWORD = process.env.AUTH_PASSWORD || ''
const AUTH_SECRET = process.env.AUTH_SECRET || ''

// Función simple para crear un token de sesión
function createSessionToken(): string {
  const timestamp = Date.now()
  const data = `${timestamp}:${AUTH_SECRET}`
  // Crear un hash simple usando base64
  return Buffer.from(data).toString('base64')
}

// Verificar si el token es válido (menos de 7 días)
function isValidToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const [timestamp, secret] = decoded.split(':')

    if (secret !== AUTH_SECRET) return false

    const tokenTime = parseInt(timestamp, 10)
    const now = Date.now()
    const sevenDays = 7 * 24 * 60 * 60 * 1000

    return now - tokenTime < sevenDays
  } catch {
    return false
  }
}

// POST: Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (password !== AUTH_PASSWORD) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }

    // Crear token de sesión
    const token = createSessionToken()

    // Crear respuesta con cookie
    const response = NextResponse.json({ success: true })

    const cookieStore = await cookies()
    cookieStore.set('zebra_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 días
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    )
  }
}

// DELETE: Logout
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('zebra_session')

  return NextResponse.json({ success: true })
}

// GET: Verificar sesión
export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('zebra_session')?.value

  if (!token || !isValidToken(token)) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true })
}

// Exportar función para usar en middleware
export { isValidToken }
