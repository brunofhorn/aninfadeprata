import { cache } from 'react'
import { redirect } from 'next/navigation'
import { findAdminById } from '@/server/admin/repository'
import { hasDatabaseUrl } from '@/server/db/prisma'
import { getAdminSession } from '@/server/admin/session'

export const getCurrentAdmin = cache(async () => {
  if (!hasDatabaseUrl()) {
    return null
  }

  const session = await getAdminSession()

  if (!session?.id) {
    return null
  }

  return findAdminById(session.id)
})

export async function requireAdminPage() {
  const admin = await getCurrentAdmin()

  if (!admin || !admin.isActive) {
    redirect('/admin/login')
  }

  return admin
}
