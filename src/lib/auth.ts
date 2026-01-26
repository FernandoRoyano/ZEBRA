const AUTH_SECRET = process.env.AUTH_SECRET || ''

// Verificar si el token es válido (menos de 7 días)
export function isValidToken(token: string): boolean {
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
