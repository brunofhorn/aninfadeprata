'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiBarChart2, FiGrid, FiMenu, FiUsers, FiX } from 'react-icons/fi'
import { AdminLogoutButton } from '@/features/admin/components/AdminLogoutButton'
import { cn } from '@/utils/cn'

interface AdminSidebarProps {
  admin: {
    name: string
    email: string
    username?: string | null
  }
  children: React.ReactNode
}

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: FiGrid },
  { href: '/admin/pedidos', label: 'Pedidos', icon: FiMenu },
  { href: '/admin/clientes', label: 'Clientes', icon: FiUsers },
  { href: '/admin/relatorios', label: 'Relatorios', icon: FiBarChart2 },
] as const

function SidebarContent({
  admin,
  pathname,
  onNavigate,
}: {
  admin: AdminSidebarProps['admin']
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/8 px-6 py-6">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-nymph-300/75">Admin</p>
        <h1 className="mt-3 text-2xl text-white">A Ninfa de Prata</h1>
        <p className="mt-3 text-sm text-white/55">{admin.name}</p>
        <p className="text-xs text-white/40">{admin.username || admin.email}</p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-5">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition',
                isActive
                  ? 'border-nymph-400/30 bg-nymph-400/10 text-nymph-300'
                  : 'border-transparent text-white/65 hover:border-white/10 hover:bg-white/6 hover:text-white',
              )}
              href={item.href}
              onClick={onNavigate}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/8 px-4 py-4">
        <AdminLogoutButton />
      </div>
    </div>
  )
}

export function AdminSidebar({ admin, children }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeItem = menuItems.find(
    (item) => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)),
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-forest-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute left-[-8rem] top-16 h-72 w-72 rounded-full bg-mystic-700/25 blur-[120px]" />
        <div className="absolute right-[-6rem] top-40 h-80 w-80 rounded-full bg-nymph-500/12 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-silver-300/10 blur-[110px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/8 bg-black/18 backdrop-blur-xl lg:block">
          <SidebarContent admin={admin} pathname={pathname} />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/8 bg-forest-950/80 backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-nymph-300/75">
                  Admin
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {activeItem?.label ?? 'Painel'}
                </p>
              </div>

              <button
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                className="rounded-full border border-white/10 bg-white/6 p-3 text-white/80"
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
              >
                {mobileOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </header>

          {mobileOpen ? (
            <div className="fixed inset-0 z-40 lg:hidden">
              <button
                aria-label="Fechar menu"
                className="absolute inset-0 bg-black/60"
                type="button"
                onClick={() => setMobileOpen(false)}
              />
              <aside className="relative z-10 h-full w-72 border-r border-white/8 bg-forest-950/95 backdrop-blur-xl">
                <SidebarContent
                  admin={admin}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              </aside>
            </div>
          ) : null}

          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
