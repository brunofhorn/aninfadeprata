'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'

export function AdminLogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const response = await fetch('/api/admin/auth/logout', {
      method: 'POST',
    })

    if (!response.ok) {
      toast.error('Nao foi possivel encerrar a sessao.')
      return
    }

    toast.success('Sessao encerrada.')
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <Button
      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/10"
      type="button"
      variant="ghost"
      onClick={handleLogout}
    >
      Sair
    </Button>
  )
}
