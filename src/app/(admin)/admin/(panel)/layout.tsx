import { AdminSidebar } from '@/features/admin/components/AdminSidebar'
import { requireAdminPage } from '@/server/admin/auth'

export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const admin = await requireAdminPage()

  return (
    <AdminSidebar
      admin={{
        name: admin.name,
        email: admin.email,
        username: admin.username,
      }}
    >
      {children}
    </AdminSidebar>
  )
}
