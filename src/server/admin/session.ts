import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/server/admin/session-token'

export { ADMIN_SESSION_COOKIE } from '@/server/admin/session-token'
export type { AdminSessionData } from '@/server/admin/session-token'
export { createAdminSessionToken, verifyAdminSessionToken } from '@/server/admin/session-token'

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

  if (!token) {
    return null
  }

  try {
    return await verifyAdminSessionToken(token)
  } catch {
    return null
  }
}
