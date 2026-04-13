import { NextResponse } from 'next/server'
import { z } from 'zod'
import { findAdminByIdentifier } from '@/server/admin/repository'
import { createAdminSessionToken } from '@/server/admin/session'
import { verifyPasswordHash } from '@/server/admin/password'
import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'

export const runtime = 'nodejs'

const loginSchema = z.object({
  identifier: z.string().trim().min(3, 'Informe o usuario ou e-mail.'),
  password: z.string().min(6, 'Informe a senha.'),
})

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ message: 'DATABASE_URL nao configurada.' }, { status: 503 })
  }

  try {
    const payload = loginSchema.parse(await request.json())
    const prisma = getPrismaClient()
    const admin = await findAdminByIdentifier(payload.identifier)

    if (!admin || !admin.isActive || !verifyPasswordHash(payload.password, admin.passwordHash)) {
      return NextResponse.json(
        { message: 'Usuario, e-mail ou senha invalidos.' },
        { status: 401 },
      )
    }

    const token = await createAdminSessionToken({
      id: admin.id,
      email: admin.email,
      username: admin.username,
      name: admin.name,
      role: admin.role,
    })

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    })

    await prisma.adminAuditLog.create({
      data: {
        adminUserId: admin.id,
        action: 'ADMIN_LOGIN',
        entityType: 'ADMIN_USER',
        entityId: admin.id,
        description: 'Login realizado no painel administrativo.',
        metadata: {
          identifier: payload.identifier,
        },
      },
    })

    const response = NextResponse.json({
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    })

    response.cookies.set({
      name: 'anp_admin_session',
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Nao foi possivel fazer login.' }, { status: 500 })
  }
}
