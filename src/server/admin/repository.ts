import { getPrismaClient } from '@/server/db/prisma'

export interface AdminRecord {
  id: string
  email: string
  username: string | null
  passwordHash: string
  name: string
  role: string
  isActive: boolean
  lastLoginAt: Date | null
}

function isMissingAdminUsernameColumnError(error: unknown) {
  return (
    error instanceof Error &&
    (error.message.includes('AdminUser.username') ||
      error.message.includes('column "username" does not exist') ||
      error.message.includes("column `AdminUser.username` does not exist"))
  )
}

function mapAdminWithoutUsername(admin: {
  id: string
  email: string
  passwordHash: string
  name: string
  role: string
  isActive: boolean
  lastLoginAt: Date | null
} | null): AdminRecord | null {
  if (!admin) {
    return null
  }

  return {
    ...admin,
    username: null,
  }
}

export async function findAdminByIdentifier(identifier: string) {
  const prisma = getPrismaClient()

  try {
    return await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email: { equals: identifier, mode: 'insensitive' } },
          { username: { equals: identifier, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
    })
  } catch (error) {
    if (!isMissingAdminUsernameColumnError(error)) {
      throw error
    }

    const admin = await prisma.adminUser.findFirst({
      where: {
        email: { equals: identifier, mode: 'insensitive' },
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
    })

    return mapAdminWithoutUsername(admin)
  }
}

export async function findAdminById(id: string) {
  const prisma = getPrismaClient()

  try {
    return await prisma.adminUser.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
    })
  } catch (error) {
    if (!isMissingAdminUsernameColumnError(error)) {
      throw error
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
    })

    return mapAdminWithoutUsername(admin)
  }
}
