import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/server/admin/auth'

export const runtime = 'nodejs'

export async function GET() {
  const admin = await getCurrentAdmin()

  if (!admin || !admin.isActive) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      id: admin.id,
      email: admin.email,
      username: admin.username,
      name: admin.name,
      role: admin.role,
    },
  })
}
