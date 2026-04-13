import { jwtVerify, SignJWT } from 'jose'

export const ADMIN_SESSION_COOKIE = 'anp_admin_session'

export interface AdminSessionData {
  id: string
  email: string
  username?: string | null
  name: string
  role: string
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim()

  if (secret) {
    return new TextEncoder().encode(secret)
  }

  if (process.env.NODE_ENV !== 'production') {
    return new TextEncoder().encode('dev-only-admin-session-secret-change-me')
  }

  throw new Error('ADMIN_SESSION_SECRET nao foi configurada.')
}

export async function createAdminSessionToken(session: AdminSessionData) {
  return new SignJWT({
    email: session.email,
    username: session.username ?? null,
    name: session.name,
    role: session.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(session.id)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSessionSecret())
}

export async function verifyAdminSessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSessionSecret())

  return {
    id: payload.sub ?? '',
    email: typeof payload.email === 'string' ? payload.email : '',
    username: typeof payload.username === 'string' ? payload.username : null,
    name: typeof payload.name === 'string' ? payload.name : '',
    role: typeof payload.role === 'string' ? payload.role : '',
  } satisfies AdminSessionData
}
