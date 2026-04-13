'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiLock, FiUser } from 'react-icons/fi'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function AdminLoginForm() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)

      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      })

      const payload = (await response.json()) as { message?: string }

      if (!response.ok) {
        throw new Error(payload.message ?? 'Nao foi possivel entrar no painel.')
      }

      toast.success('Login realizado com sucesso.')
      router.push('/admin')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Nao foi possivel entrar no painel.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5">
        <div className="relative">
          <div className="pointer-events-none absolute left-4 top-[2.95rem] text-white/35">
            <FiUser />
          </div>
          <Input
            autoComplete="username"
            className="pl-11"
            id="identifier"
            label="Usuario ou e-mail"
            name="identifier"
            placeholder="saraadmin ou admin@aninfadeprata.com"
            required
            tone="dark"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
          />
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-4 top-[2.95rem] text-white/35">
            <FiLock />
          </div>
          <Input
            autoComplete="current-password"
            className="pl-11"
            id="password"
            label="Senha"
            name="password"
            placeholder="Digite sua senha"
            required
            tone="dark"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </div>

      <Button
        className="w-full rounded-2xl bg-linear-to-r from-silver-300 to-silver-200 py-3 font-bold text-forest-950 hover:brightness-105"
        disabled={isSubmitting}
        type="submit"
        variant="ghost"
      >
        {isSubmitting ? 'Entrando...' : 'Entrar no painel'}
      </Button>
    </form>
  )
}
